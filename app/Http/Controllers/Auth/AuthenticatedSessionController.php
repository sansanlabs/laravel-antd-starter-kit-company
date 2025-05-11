<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class AuthenticatedSessionController extends Controller {
  /**
   * Show the login page.
   */
  public function index(): Response {
    return inertia("auth/login/index");
  }

  /**
   * Redirect to microsoft login page.
   */
  public function microsoftRedirect(Request $request): RedirectResponse {
    return Socialite::driver("microsoft")
      ->with(["prompt" => "select_account"])
      ->redirect();
  }

  /**
   * Callback after login
   */
  public function microsoftCallback(): RedirectResponse {
    $user = Socialite::driver("microsoft")
      ->scopes(["offline_access"])
      ->user();

    $userData = [
      "microsoft_id" => $user->getId(),
      "name" => $user->getName(),
      "email" => $user->getEmail(),
    ];

    $existingUser = User::where("email", $user->getEmail())->first();

    $loggedInUser = $existingUser ? tap($existingUser)->update($userData) : User::create($userData);

    auth()->login($loggedInUser);

    session([
      "microsoft_access_token" => $user->token,
      "microsoft_refresh_token" => $user->refreshToken,
    ]);
    session()->save();

    $session = Session::find(session()->getId());
    activity("sessions")
      ->event("created")
      ->by(auth()->user())
      ->withProperties([
        "attributes" => $session,
      ])
      ->log(":causer.name login");

    return redirect()->intended(route("dashboard.index", absolute: false));
  }

  /**
   * Destroy an authenticated session.
   */
  public function logout(Request $request): RedirectResponse {
    $session = Session::find(session()->getId());

    activity("sessions")
      ->event("deleted")
      ->by(auth()->user())
      ->withProperties([
        "old" => $session,
      ])
      ->log(":causer.name logout");

    auth()->guard("web")->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect("/");
  }
}
