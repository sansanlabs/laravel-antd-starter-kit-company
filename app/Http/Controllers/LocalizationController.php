<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocalizationController extends Controller {
  public function update(Request $request): RedirectResponse {
    $locale = $request->validate([
      "locale" => ["required", "string", "max:2", "in:en,id,ja"],
    ])["locale"];

    session()->put("locale", $locale);

    return back();
  }
}
