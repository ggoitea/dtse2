<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class LauncherController extends Controller
{
    public function index()
    {
        return Inertia::render('launcher');
    }
}
