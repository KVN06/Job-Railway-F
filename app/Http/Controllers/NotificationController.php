<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // ✅ Importante

class NotificationController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Debes iniciar sesión.');
        }

        $notifications = Notification::where('user_id', Auth::user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return view('notifications.index', compact('notifications'));
    }

    public function create()
    {
        return view('notifications.form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string|max:255',
        ]);

        $notification = new Notification();
        $notification->user_id = $request->user_id;
        $notification->message = $request->message;
        $notification->read = false;
        $notification->save();

        return redirect()->back()->with('success', 'Notificación creada correctamente.');
    }

    public function markAsRead($id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::user()->id)
            ->first();

        if ($notification) {
            $notification->read = true;
            $notification->save();
        }

        return response()->json(['success' => true]);
    }

    public function getUnreadCount()
    {
        if (!Auth::check()) {
            return response()->json(['count' => 0]);
        }

        $count = Notification::where('user_id', Auth::user()->id)
            ->where('read', false)
            ->count();

        return response()->json(['count' => $count]);
    }
}
