<?php

namespace App\Http\Controllers\Settings;

use App\Enums\Permission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the roles.
     */
    public function index(Request $request): Response
    {
        $this->authorize(Permission::RolesView->value);

        $roles = Role::query()
            ->where('name', '!=', 'owner')
            ->withCount(['users', 'permissions'])
            ->when(
                $request->search,
                fn ($query, $search) => $query
                    ->where('name', 'like', "%{$search}%")
            )
            ->orderBy('name')
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('settings/roles/index', [
            'roles' => $roles,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create(): Response
    {
        $this->authorize(Permission::RolesCreate->value);

        return Inertia::render('settings/roles/create', [
            'availablePermissions' => Permission::groupedOptions(),
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {

        $role = Role::create([
            'name' => $request->validated('name'),
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($request->validated('permissions'));

        return redirect()
            ->route('settings.roles.index')
            ->with('success', 'Rol creado exitosamente.');
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role): Response
    {
        $this->authorize(Permission::RolesEdit->value);

        return Inertia::render('settings/roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ],
            'availablePermissions' => Permission::groupedOptions(),
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $role->update([
            'name' => $request->validated('name'),
        ]);

        $role->syncPermissions($request->validated('permissions'));

        return redirect()
            ->route('settings.roles.index')
            ->with('success', 'Rol actualizado exitosamente.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize(Permission::RolesDelete->value);

        if ($role->name === 'owner') {
            abort(403, 'No se puede eliminar el rol de propietario.');
        }

        if ($role->users()->count() > 0) {
            return redirect()
                ->route('settings.roles.index')
                ->with('error', 'No se puede eliminar un rol que tiene usuarios asignados.');
        }

        $role->delete();

        return redirect()
            ->route('settings.roles.index')
            ->with('success', 'Rol eliminado exitosamente.');
    }
}
