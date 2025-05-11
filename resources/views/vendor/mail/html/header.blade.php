@props(["url"])
<tr>
  <td class="header">
    <a href="{{ $url }}" style="display: inline-block;">
      {{-- @if (trim($slot) === "Laravel")
        <img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
      @else
        {{ $slot }}
      @endif --}}
      <img src={{ asset("assets/images/logo-os-selnajaya.png") }} alt="Logo Selnajaya" class="logo">
    </a>
  </td>
</tr>
