<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanAccessWebsite {
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response {
    if (!auth()->check()) {
      return redirect()->route("login");
    }

    $user = auth()->user();
    $host = parse_url($request->root(), PHP_URL_HOST);

    $response = Http::acceptJson()
      ->withOptions(["verify" => env("APP_ENV") === "production" ?? false])
      ->get("https://", [
        "email" => $user->email,
        "url" => $host,
      ]);

    abort_if($response->clientError(), 403, __("lang.access_denied_you_are_not_authorized_to_visit_this_site"));
    abort_if($response->serverError(), 500);

    return $next($request);
  }
}
