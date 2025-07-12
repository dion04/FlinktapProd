@props(['url'])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if (trim($slot) === 'Flink')
                <img src="{{ asset('assets/images/Flink-logo.svg') }}" class="logo" alt="Flink Logo">
            @else
                {!! $slot !!}
            @endif
        </a>
    </td>
</tr>