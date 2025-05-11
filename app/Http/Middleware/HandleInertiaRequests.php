<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware {
  /**
   * The root template that's loaded on the first page visit.
   *
   * @see https://inertiajs.com/server-side-setup#root-template
   *
   * @var string
   */
  protected $rootView = "app";

  /**
   * Determines the current asset version.
   *
   * @see https://inertiajs.com/asset-versioning
   */
  public function version(Request $request): ?string {
    return parent::version($request);
  }

  /**
   * Define the props that are shared by default.
   *
   * @see https://inertiajs.com/shared-data
   *
   * @return array<string, mixed>
   */
  public function share(Request $request): array {
    [$message, $author] = str(Inspiring::quotes()->random())->explode("-");
    $locale = session()->has("locale") ? session("locale") : app()->getLocale();

    return [
      ...parent::share($request),
      "companyName" => config("app.company_name"),
      "appName" => config("app.name"),
      "locale" => $locale,
      "roles" => auth()->user() ? $request->user()->roles()->pluck("name") : [],
      "permissions" => auth()->user() ? $request->user()->getPermissionsViaRoles()->pluck("name")->unique()->values()->all() : [],
      "quote" => ["message" => trim($message), "author" => trim($author)],
      "auth" => [
        "user" => $request->user(),
      ],
      "ziggy" => fn(): array => [...(new Ziggy())->toArray(), "location" => $request->url()],
      "sidebarOpen" => !$request->hasCookie("sidebar_state") || $request->cookie("sidebar_state") === "true",
    ];
  }
}
