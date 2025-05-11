<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Models\Session;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Response;

class MicrosoftAuthenticated {
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): RedirectResponse|Response {
    $accessToken = session()->get("microsoft_access_token");

    if (!$accessToken) {
      $authSession = new AuthenticatedSessionController();
      return $authSession->logout($request);
    }

    try {
      Socialite::driver("microsoft")->userFromToken($accessToken);
      return $next($request);
    } catch (\Throwable $th) {
      return $this->handleInvalidToken($request, $next);
    }
  }

  protected function handleInvalidToken(Request $request, Closure $next): mixed {
    try {
      $microsoftRefreshTokens = session()->get("microsoft_refresh_token");
      $microsoftNewTokens = Socialite::driver("microsoft")->refreshToken($microsoftRefreshTokens);

      session([
        "microsoft_access_token" => $microsoftNewTokens->token,
        "microsoft_refresh_token" => $microsoftNewTokens->refreshToken,
      ]);
      session()->save();

      $session = Session::find(session()->getId());
      activity("sessions")
        ->by(auth()->user())
        ->event("updated")
        ->withProperties([
          "attributes" => $session,
        ])
        ->log("updated tokens by system (:causer.name)");

      return $next($request);
    } catch (\Throwable $th) {
      $authSession = new AuthenticatedSessionController();
      return $authSession->logout($request);
    }
  }
}
