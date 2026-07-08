<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        @page {
            margin: 1cm;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 9pt;
            color: #333;
            line-height: 1.4;
            background-color: #fff;
        }

        .header-table {
            width: 100%;
            border-bottom: 2px solid #444;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }

        .title {
            font-size: 14pt;
            font-weight: bold;
            color: #222;
            text-transform: uppercase;
        }

        .section-title {
            background-color: #f2f2f2;
            padding: 5px 10px;
            font-weight: bold;
            border-left: 4px solid #444;
            margin-top: 15px;
            margin-bottom: 10px;
            font-size: 10pt;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
        }

        th {
            background-color: #eee;
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
            font-size: 9pt;
        }

        td {
            padding: 8px;
            border: 1px solid #ddd;
            vertical-align: top;
        }

        .info-box {
            width: 49%;
            display: inline-block;
            vertical-align: top;
            margin-right: 1.5%;
        }

        .info-box-last {
            width: 49%;
            display: inline-block;
            vertical-align: top;
            margin-right: 0;
        }

        .label {
            font-weight: bold;
            display: inline-block;
            font-size: 8pt;
            color: #666;
            /* margin-bottom: 2px; */
        }

        .value {
            display: inline-block;
            /* margin-bottom: 8px; */
        }

        .text-right {
            text-align: right;
        }

        .summary-table {
            width: 100%;
            margin-top: 20px;
        }

        .summary-table th {
            background-color: #444;
            color: #fff;
            text-align: center;
            font-size: 9pt;
        }

        .summary-table td {
            text-align: center;
            font-size: 9pt;
        }

        .grand-total {
            background-color: #222;
            color: #fff;
            font-size: 10pt;
            font-weight: bold;
            text-align: right;
        }

        .badge {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8pt;
            background: #eee;
        }

        .badge-responsable {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8pt;
            background: #444;
            color: #fff;
        }

        .badge-ayudante {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8pt;
            background: #ddd;
            color: #333;
        }

        .clear {
            clear: both;
        }
    </style>
</head>

<body>

    <table class="header-table">
        <tr>
            <td style="width: 55px; border: 0; vertical-align: middle; padding-right: 10px;">
                <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('img/logo_isotipo500x500.png'))) }}"
                    style="height: 45px; width: auto; display: block;">
            </td>
            <td style="vertical-align: middle;border: 0;">
                @section('titulo')
                <div class="title">{{ $titulo ?? 'Informe de Servicio' }}</div>
                @show
            </td>
            <td class="text-right" style="vertical-align: middle;border: 0;">
                @section('info')
                <div>Fecha de impresión: {{ now()->format('d/m/Y H:i') }}</div>
                @show
            </td>
            @if ($qrCode??null)
            <td style="vertical-align: middle; border: 0; text-align: right; padding-left: 10px; width: 80px;">
                <img src="data:image/png;base64,{{ $qrCode }}" style="height: 70px; width: 70px; display: block;">
            </td>
            @endif
        </tr>
    </table>

    @yield('content')


</body>

</html>