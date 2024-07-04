<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'document' => ['required', 'string', 'max:20', 'unique:' . User::class],
            'type' => 'required|in:client,company',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()]
        ]);

        // Cria o usuário com o tipo de documento recebido
        $user = User::create([
            'name' => $request->name,
            'document' => $request->document,
            'type' => $request->type,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'image' => 'uploads/user-default.png'
        ]);

        event(new Registered($user));

        Auth::login($user);

        if ($request->type === 'company') {
            return redirect(route('dashboardCompany.index', absolute: false));
        } else {
            return redirect(route('dashboard', absolute: false));
        }
    }
}
