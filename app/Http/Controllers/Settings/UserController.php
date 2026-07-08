<?php

namespace App\Http\Controllers\Settings;

use App\Enums\Permission;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize(Permission::UsersView->value);

        $users = User::query()
            ->where('id', '!=', Auth::id())
            ->with('roles:id,name')
            ->filter($request->only(['search']))
            ->orderBy('name')
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('settings/users/index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize(Permission::UsersCreate->value);

        $roles = Role::query()
            ->where('name', '!=', 'owner')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('settings/users/create', [
            'roles' => $roles,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'username' => $request->validated('username'),
            'email' => $request->validated('email'),
            'password' => $request->validated('password'),
        ]);

        $user->assignRole($request->validated('role_id'));

        return redirect()
            ->route('settings.users.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    public function edit(User $user): Response
    {
        $this->authorize(Permission::UsersEdit->value);

        $roles = Role::query()
            ->where('name', '!=', 'owner')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('settings/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role_id' => $user->roles->first()?->id,
            ],
            'roles' => $roles,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {

        $data = [
            'name' => $request->validated('name'),
            'username' => $request->validated('username'),
            'email' => $request->validated('email'),
            'dni' => $request->validated('dni'),
            'telefono' => $request->validated('telefono'),
            'direccion' => $request->validated('direccion'),
        ];

        if ($request->validated('password')) {
            $data['password'] = $request->validated('password');
        }

        $user->update($data);

        $user->syncRoles([$request->validated('role_id')]);

        return redirect()
            ->route('settings.users.show', $user)
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->authorize(Permission::UsersDelete->value);

        if ($user->id === Auth::id()) {
            abort(403, 'No puedes eliminarte a ti mismo.');
        }

        if ($user->hasRole('owner')) {
            abort(403, 'No se puede eliminar un usuario con rol de propietario.');
        }

        $user->delete();

        return redirect()
            ->route('settings.users.index')
            ->with('success', 'Usuario eliminado exitosamente.');
    }
}
