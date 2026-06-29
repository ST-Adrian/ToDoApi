'use client';

import { useState, useEffect, useCallback } from 'react';

interface Tarea {
    id: number;
    titulo: string;
    estaCompletada: boolean;
    usuarioId?: string; // Agregamos la referencia al modelo
}

export default function TodoApp() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [nuevoTitulo, setNuevoTitulo] = useState('');
    const [error, setError] = useState('');
    const [filtroActivo, setFiltroActivo] = useState<'todos' | 'completados'>('todos');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // NUEVO: Estado para almacenar la identidad secreta del usuario
    const [usuarioId, setUsuarioId] = useState<string>('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // 1. GENERAR O LEER IDENTIDAD AL ABRIR LA PÁGINA
    useEffect(() => {
        let idGuardado = localStorage.getItem('todo_usuario_id');
        if (!idGuardado) {
            // Si es un usuario nuevo, le creamos un código único aleatorio
            idGuardado = 'anon-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
            localStorage.setItem('todo_usuario_id', idGuardado);
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsuarioId(idGuardado);
    }, []);

    // 2. MODIFICAR EL FETCH PARA ENVIAR EL ID (Por Query String)
    const fetchTareas = useCallback(async () => {
        if (!usuarioId) return; // Esperamos a que se cargue la identidad

        try {
            const res = await fetch(`${API_URL}?usuarioId=${usuarioId}`);
            const data = await res.json();
            setTareas(data);
        } catch (err) {
            console.error("Error conectando a la API:", err);
        }
    }, [API_URL, usuarioId]);

    useEffect(() => {
        if (usuarioId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchTareas();
        }
    }, [fetchTareas, usuarioId]);

    // 3. ENVIAR EL ID EN EL BODY AL CREAR
    const agregarTarea = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoTitulo.trim() || !usuarioId) return;
        setError('');

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Sumamos el usuarioId al JSON que viaja al backend
                body: JSON.stringify({ titulo: nuevoTitulo, estaCompletada: false, usuarioId })
            });

            if (!res.ok) {
                const errorData = await res.json();

                if (errorData.errors && errorData.errors.Titulo) {
                    setError(`⚠️ ${errorData.errors.Titulo[0]}`);
                }
                else if (errorData.mensaje) {
                    setError(`⚠️ ${errorData.mensaje}`);
                }
                else {
                    setError('⚠️ Error al crear la tarea');
                }
                return;
            }

            setNuevoTitulo('');
            fetchTareas();
        } catch (err) {
            console.error("Error:", err);
            setError('⚠️ Error de conexión con el servidor');
        }
    };

    // 4. ENVIAR EL ID EN LA RUTA PARA LAS DEMÁS ACCIONES
    const toggleCompletada = async (tarea: Tarea) => {
        try {
            await fetch(`${API_URL}/${tarea.id}?usuarioId=${usuarioId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...tarea, estaCompletada: !tarea.estaCompletada, usuarioId })
            });
            fetchTareas();
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const eliminarTarea = async (id: number) => {
        try {
            await fetch(`${API_URL}/${id}?usuarioId=${usuarioId}`, { method: 'DELETE' });
            fetchTareas();
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const completarTodos = async () => {
        await fetch(`${API_URL}/completar-todos?usuarioId=${usuarioId}`, { method: 'PUT' });
        fetchTareas();
    };

    const restaurarTodos = async () => {
        await fetch(`${API_URL}/restaurar-todos?usuarioId=${usuarioId}`, { method: 'PUT' });
        fetchTareas();
    };

    const limpiarTodos = async () => {
        await fetch(`${API_URL}/eliminar-todos?usuarioId=${usuarioId}`, { method: 'DELETE' });
        fetchTareas();
    };

    const tareasRestantes = tareas.filter(t => !t.estaCompletada).length;
    const tareasFiltradas = tareas.filter(t => {
        if (filtroActivo === 'completados') return t.estaCompletada;
        return true;
    });

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col items-center relative overflow-hidden">

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 14px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1e293b;
                    border-left: 4px solid black;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ec4899; 
                    border: 4px solid black;
                    border-radius: 12px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #f472b6;
                }
            `}} />

            <nav className="fixed top-0 w-full p-4 flex justify-end gap-6 items-center z-50 pointer-events-none">
                <div className="flex gap-6 pointer-events-auto bg-[#0f172a]/80 p-2 rounded-xl backdrop-blur-sm">
                    <a href="https://github.com/ST-Adrian/ToDoApi" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        <span className="font-bold hidden sm:inline">Repo</span>
                    </a>
                    <a href="https://docs.google.com/document/d/1tnyzw0MtGT_q8M9UglgAQl6xl3dK-X83hYjBHbDvbGk/edit?usp=sharing" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span className="font-bold hidden sm:inline">Monografía</span>
                    </a>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <span className="font-bold hidden sm:inline">About</span>
                    </button>
                </div>
            </nav>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 pointer-events-auto">
                    <div className="bg-slate-800 border-4 border-black rounded-xl p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 font-black text-xl hover:text-red-400">X</button>
                        <h2 className="text-3xl font-black text-yellow-400 mb-6 text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Detalles del Proyecto</h2>
                        <div className="space-y-4 text-center font-semibold text-lg">
                            <p className="bg-slate-700 p-2 rounded border-2 border-black">🏛️ Universidad Nacional de Córdoba (UNC)</p>
                            <p className="bg-slate-700 p-2 rounded border-2 border-black">💻 Analista Universitario de Sistemas Informáticos (AUSI)</p>
                            <p className="bg-slate-700 p-2 rounded border-2 border-black">📚 Programación Aplicada I - TP N° 1</p>
                            <div className="bg-teal-900 border-2 border-black rounded p-3 text-teal-100">
                                <p className="font-black mb-2 text-teal-300">👥 Grupo 1</p>
                                <ul className="text-base space-y-1">
                                    <li>Leandro Brangi</li>
                                    <li>Fernando Raul Caceres</li>
                                    <li>Facundo Martin Rodriguez</li>
                                    <li>Adrián Emanuel Sánchez Tejeda</li>
                                    <li>Sergio Velez Hernandez</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-14 w-full flex flex-col items-center">

                <h1 className="text-5xl md:text-6xl font-black text-yellow-400 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] tracking-widest mb-8">
                    TODO LIST
                </h1>

                <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 justify-center p-4">

                    <div className="hidden md:block w-56 shrink-0"></div>

                    <div className="w-full max-w-3xl flex flex-col gap-2">
                        <form onSubmit={agregarTarea} className="flex flex-col gap-2">
                            <div className="flex w-full">
                                <input
                                    type="text"
                                    placeholder="Agregar una tarea..."
                                    value={nuevoTitulo}
                                    maxLength={50}
                                    onChange={(e) => setNuevoTitulo(e.target.value)}
                                    className="flex-1 p-4 bg-slate-800 border-4 border-black rounded-l-xl text-white placeholder-slate-400 focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center md:text-left"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-4 bg-pink-500 hover:bg-pink-400 text-black font-black border-y-4 border-r-4 border-black rounded-r-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-1 active:shadow-none shrink-0"
                                >
                                    Agregar
                                </button>
                            </div>
                            {error && <p className="text-red-400 font-bold px-2 text-center md:text-left">{error}</p>}
                        </form>

                        <div className="bg-slate-800 border-4 border-black rounded-xl flex flex-col overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex border-b-4 border-black bg-slate-700">
                                <div className="w-full px-4 py-3 bg-teal-500 text-black font-bold text-center">
                                    ¡Actuá ahora, simplificá tu vida! ☕
                                </div>
                            </div>

                            <div className="p-4 flex flex-col gap-3 max-h-[280px] overflow-y-auto custom-scrollbar">
                                {tareasFiltradas.length === 0 ? (
                                    <p className="text-slate-400 text-center py-6">No hay tareas para mostrar.</p>
                                ) : (
                                    tareasFiltradas.map((tarea) => (
                                        <div
                                            key={tarea.id}
                                            className={`flex items-center justify-between p-3 border-4 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors shrink-0 w-full
                                            ${tarea.estaCompletada ? 'bg-[#064e3b] text-teal-200 line-through' : 'bg-slate-100 text-black'}`}
                                        >
                                            <div className="flex items-center gap-3 cursor-pointer min-w-0 flex-1" onClick={() => toggleCompletada(tarea)}>
                                                <div className={`shrink-0 w-6 h-6 border-2 border-black rounded-full flex items-center justify-center ${tarea.estaCompletada ? 'bg-teal-400' : 'bg-white'}`}>
                                                    {tarea.estaCompletada && <span className="text-black text-sm font-bold">✓</span>}
                                                </div>
                                                <span className="font-semibold text-lg break-all">{tarea.titulo}</span>
                                            </div>

                                            <button
                                                onClick={() => eliminarTarea(tarea.id)}
                                                className="shrink-0 w-8 h-8 flex items-center justify-center bg-slate-200 border-2 border-black rounded-full text-black font-bold hover:bg-red-400 transition-colors ml-2"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t-4 border-black bg-slate-200 p-3 text-black font-bold text-center shrink-0">
                                {tareasRestantes > 0 ? `Quedan ${tareasRestantes} tareas` : '¡Todo completado, buen trabajo! 🎉'}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-56 shrink-0 flex flex-col gap-6">

                        <div className="bg-slate-800 border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col text-center font-bold">
                            <div className="bg-teal-500 p-3 text-black font-black border-b-4 border-black">
                                FILTROS ✨
                            </div>
                            <button
                                onClick={() => setFiltroActivo('todos')}
                                className={`p-3 border-b-4 border-black transition-colors ${filtroActivo === 'todos' ? 'bg-pink-300 text-black' : 'text-slate-200 hover:bg-slate-700'}`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setFiltroActivo('completados')}
                                className={`p-3 transition-colors ${filtroActivo === 'completados' ? 'bg-pink-300 text-black' : 'text-slate-200 hover:bg-slate-700'}`}
                            >
                                Completadas
                            </button>
                        </div>

                        <div className="bg-slate-800 border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col text-center font-bold">
                            <div className="bg-teal-500 p-3 text-black font-black border-b-4 border-black">
                                ACCIONES 🚀
                            </div>
                            <button onClick={completarTodos} className="p-3 border-b-4 border-black text-slate-200 hover:bg-teal-900 transition-colors">
                                Terminar todas
                            </button>
                            <button onClick={restaurarTodos} className="p-3 border-b-4 border-black text-slate-200 hover:bg-slate-700 transition-colors">
                                Abrir todas de nuevo
                            </button>
                            <button onClick={limpiarTodos} className="p-3 text-red-400 hover:bg-red-950 transition-colors">
                                Limpiar todas
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
