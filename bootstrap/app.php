<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\MicrosoftAuthenticated;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(web: __DIR__ . "/../routes/web.php", commands: __DIR__ . "/../routes/console.php", health: "/up")
  ->withMiddleware(function (Middleware $middleware) {
    $middleware->encryptCookies(except: ["appearance", "sidebar_state"]);

    $middleware->web(append: [HandleAppearance::class, HandleInertiaRequests::class, AddLinkHeadersForPreloadedAssets::class]);

    $middleware->alias([
      "ms_auth" => MicrosoftAuthenticated::class,
    ]);
  })
  ->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->respond(function (Response $response, Throwable $exception, Request $request): RedirectResponse|Response {
      if (app()->environment(["production"]) && in_array($response->getStatusCode(), [500, 503, 404, 403])) {
        $locale = session()->has("locale") ? session("locale") : app()->getLocale();

        return inertia("error", [
          "companyName" => config("app.company_name"),
          "appName" => config("app.name"),
          "locale" => $locale,
          "roles" => auth()->user() ? $request->user()->roles()->pluck("name") : [],
          "permissions" => auth()->user() ? $request->user()->getPermissionsViaRoles()->pluck("name")->unique()->values()->all() : [],
          "auth" => [
            "user" => $request->user(),
          ],
          "status" => $response->getStatusCode(),
        ])
          ->toResponse($request)
          ->setStatusCode($response->getStatusCode());
      }

      if ($response->getStatusCode() === 419) {
        return back()->with([
          "message" => "The page expired, please try again.",
        ]);
      }

      return $response;
    });
  })
  ->create();
