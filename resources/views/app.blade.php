<!DOCTYPE html>
<html lang="{{ str_replace("_", "-", app()->getLocale()) }}" @class(["dark" => ($appearance ?? "system") == "dark"])>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title inertia>{{ config("app.name", "Laravel") }}</title>

  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=geist:400,500,600,700,800,900" rel="stylesheet" />

  @routes
  @viteReactRefresh
  @vite(["resources/js/app.tsx", "resources/js/pages/{$page["component"]}.tsx"])
  @inertiaHead
</head>

<body class="antialiased">
  @inertia
</body>

</html>
