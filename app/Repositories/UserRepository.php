<?php
namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function getAll($search = null, $role = null, $sortDir = 'asc')
    {
        $query = User::with('roles');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (!empty($role) && $role !== 'All Users') {
            $roleName = strtolower(trim($role));
            if ($roleName === 'user') {
                $query->whereHas('roles', function ($r) {
                    $r->whereIn('name', ['user', 'member']);
                });
            } else {
                $query->whereHas('roles', function ($r) use ($roleName) {
                    $r->where('name', $roleName);
                });
            }
        }

        $direction = strtolower($sortDir) === 'desc' ? 'desc' : 'asc';
        return $query->orderBy('id', $direction)->paginate(10);
    }

    public function find($id)
    {
        return User::with('roles')->findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(User $user, array $data)
    {
        $user->update($data);
        return $user->fresh();
    }

    public function delete(User $user)
    {
        return $user->delete();
    }
}