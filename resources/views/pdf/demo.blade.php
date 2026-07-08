<div style="width: 100%;">
    <div class="info-box">
        <div class="section-title">Datos del Cliente</div>
        <div>
            <span class="label">Cliente:</span>
            <span class="value">{{ $ticket['cliente']['razon_social'] }}</span>
        </div>
        <div>
            <span class="label">Dirección:</span>
            <span class="value">{{ $ticket['cliente']['direccion'] }}</span>
        </div>
        <div>
            <span class="label">Encargado / Tel:</span>
            <span class="value">{{ $ticket['responsable_nombre'] }} / {{ $ticket['responsable_telefono'] }}</span>
        </div>
    </div>

    <div class="info-box-last">
        <div class="section-title">Historial de Estados</div>
        <table>
            <tbody>
                @forelse ($ticket['ticket_estados'] as $estado)
                <tr>
                    <td>{{ $estado['created_at'] }}</td>
                    <td><span class="badge">{{ $estado['estado_label'] }}</span></td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" style="text-align: center; font-style: italic; color: #888;">Sin historial de
                        estados.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>


    <div class="section-title">Datos del Problema</div>
    <table>
        <thead>
            <tr>
                <th>Sector</th>
                <th>Equipo</th>
                <th>Problema</th>
                <th width="20">ADJ</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ ($ticket['sector']['nombre'] ?? '—') }}</td>
                <td>{{ $ticket['equipo_descripcion'] ?? $ticket['equipo']['descripcion'] ?? '—' }}</td>
                <td>{{ $ticket['descripcion'] ?? '—' }}</td>
                <td style="text-align: center;">
                    @if (($ticket['mediaUrl']))
                    <a href="{{ $ticket['mediaUrl'] }}" target="_blank" style="display: inline-block">
                        <img src="{{ base_path('app/Services/Ticket/Gestion/views/img/iconmonstr-eye-9.png') }}"
                            style="width: 0.4cm">
                    </a>
                    @else
                    -
                    @endif
                </td>
            </tr>
        </tbody>
    </table>

    <div class="clear"></div>

    <div class="section-title">Reparaciones Realizadas y Materiales</div>
    <table>
        <thead>
            <tr>
                <th>Descripción</th>
                <th width="20">ADJ</th>
                <th width="20">Cant.</th>
                <th width="70">Unitario</th>
                <th width="80">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($ticket['tareas'] as $tarea)
            <tr>
                <td><strong>{{ $tarea['servicio_detalle'] }}</strong></td>
                <td style="text-align: center">
                    @if ((count($tarea['adjuntos'])??null))
                    <a href="{{ $tarea['adjuntos'][0]['url'] }}" target="_blank" style="display: inline-block">
                        <img src="{{ base_path('app/Services/Ticket/Gestion/views/img/iconmonstr-eye-9.png') }}"
                            style="width: 0.4cm">
                    </a>
                    @else
                    -
                    @endif
                </td>
                <td>01</td>
                <td>${{ number_format($tarea['costo_servicio'], 2, ',', '.') }}</td>
                <td>${{ number_format($tarea['costo_total'], 2, ',', '.') }}</td>
            </tr>
            @foreach ($tarea['materiales'] as $material)
            <tr>
                <td>{{ $material['articulo_detalle'] }}</td>
                <td></td>
                <td>{{ str_pad($material['cantidad'], 2, '0', STR_PAD_LEFT) }}</td>
                <td>${{ number_format($material['costo_unitario'], 2, ',', '.') }}</td>
                {{-- <td>—</td> --}}
                <td>${{ number_format($material['costo_total'], 2, ',', '.') }}</td>
            </tr>
            @endforeach
            @empty
            <tr>
                <td colspan="5" style="text-align: center; font-style: italic; color: #888;">Sin tareas registradas.
                </td>
            </tr>
            @endforelse
        </tbody>
        @if(count($ticket['tareas']??[]))
        <tfoot>
            <tr style="font-weight: bold;">
                <td colspan="4" style=""></td>
                <td colspan="1"
                    style="text-align: right; background-color: #eee; text-transform: uppercase; white-space: nowrap;">
                    Total: $ {{
                    number_format($ticket['total_reparacion_materiales'], 2, ',', '.') }}</td>
            </tr>
        </tfoot>
        @endif
    </table>

    <div class="section-title">Otros Extras</div>
    <table>
        <thead>
            <tr>
                <th>Descripción</th>
                <th width="20">ADJ</th>
                <th width="20">Cant.</th>
                <th width="70">Unitario</th>
                <th width="80">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($ticket['otros_extras'] as $extra)
            <tr>
                <td>{{ $extra['descripcion'] }}</td>
                <td style="text-align: center">
                    @if (($extra['adjunto']??null))
                    <a href="{{ $extra['adjunto']['url'] }}" target="_blank" style="display: inline-block">
                        <img src="{{ base_path('app/Services/Ticket/Gestion/views/img/iconmonstr-eye-9.png') }}"
                            style="width: 0.4cm">
                    </a>
                    @else
                    -
                    @endif
                </td>
                <td>{{ str_pad($extra['cantidad'], 2, '0', STR_PAD_LEFT) }}</td>
                <td>${{ number_format($extra['precio_unitario'], 2, ',', '.') }}</td>
                <td>${{ number_format($extra['total'], 2, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="2" style="text-align: center; font-style: italic; color: #888;">Sin extras registrados.
                </td>
            </tr>
            @endforelse
            @if(count($ticket['otros_extras']??[]))
        <tfoot>
            <tr>
                <td colspan="4"></td>
                <td colspan="1"
                    style="text-align: right; font-weight: bold; background-color: #eee; text-transform: uppercase; white-space: nowrap;">
                    Total: ${{ number_format($ticket['total_otros_extras'], 2, ',', '.') }}</td>
            </tr>
        </tfoot>
        @endif
        </tbody>
    </table>

    <div class="section-title">Horas Extras</div>
    <table>
        <thead>
            <tr style="text-transform: uppercase">
                <th>Nombre y Apellido</th>
                <th>DNI</th>
                <th>Descripción</th>
                <th width="80">Horas</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($ticket['horas_extras'] as $horaExtra)
            @foreach ($ticket['tecnicos'] as $tecnico)
            <tr>
                <td>{{ $tecnico['name'] }}</td>
                <td>{{ $tecnico['dni'] }}</td>
                <td>{{ $horaExtra['descripcion'] }} </td>
                <td>
                    {{ $horaExtra['cantidad'] }} {{ $horaExtra['cantidad'] == 1 ?
                    'hora'
                    : 'horas' }}
                </td>
            </tr>
            @endforeach
            @empty
            <tr>
                <td colspan="4" style="text-align: center; font-style: italic; color: #888;">Sin horas extras
                    registradas.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <table class="summary-table" style="margin-bottom: 0px;">
        <thead>
            <tr>
                <th>Total Tareas</th>
                <th>Total Materiales</th>
                <th>Total Horas Extra</th>
                <th>Total Otros Extras</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${{ number_format($ticket['total_tareas'], 2, ',', '.') }}</td>
                <td>${{ number_format($ticket['total_materiales'], 2, ',', '.') }}</td>
                <td>${{ number_format($ticket['total_horas_extra'], 2, ',', '.') }}</td>
                <td>${{ number_format($ticket['total_otros_extras'], 2, ',', '.') }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" class="grand-total">
                    TOTAL FINAL: ${{ number_format($ticket['total_general'], 2, ',', '.') }}
                </td>
            </tr>
        </tfoot>
    </table>

    @if (!is_null($firma))
    <div style="margin-top: 0mm; text-align: right;">
        <div style="margin-top: 0mm; text-align: center; display: inline-block;">
            <div class="section-title" style="border-left:none">Firma de conformidad</div>
            <img src="data:{{ $firma['mime_type'] }};base64,{{ $firma['base64'] }}"
                style="max-height: 1.2cm; max-width: 400px; display: block; margin: 10px auto;">
            <div style="margin: auto">{{ $firma['aclaracion'] }}</div>
        </div>
    </div>
    @endif
</div>