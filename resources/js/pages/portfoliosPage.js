import { listPortfolios, deletePortfolio } from '../api/portfolios.js';
import { ROOT_BASE_URL } from '../api/http.js';
import { requireRole } from '../auth/permissions.js';

function h(tag, attrs = {}, ...children) {
	const el = document.createElement(tag);
	for (const [k, v] of Object.entries(attrs || {})) {
		if (k === 'class') el.className = v;
		else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
		else el.setAttribute(k, v);
	}
	for (const ch of children.flat()) {
		if (ch == null) continue;
		el.appendChild(ch instanceof Node ? ch : document.createTextNode(String(ch)));
	}
	return el;
}

function getArray(data){ return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []); }
function resolvePdfUrl(name){ if(!name) return null; if (/^https?:\/\//i.test(name)) return name; return `${ROOT_BASE_URL}/storage/portfolios/${encodeURIComponent(name)}`; }

function headerBlock(){
	return h('div', { class: 'mb-8 animate-fade-in-up' },
		h('div', { class: 'bg-white rounded-2xl shadow-soft p-8 mb-6 border border-blue-900/30' },
			h('div', { class: 'flex flex-col md:flex-row justify-between items-center' },
				h('div', { class: 'mb-4 md:mb-0' },
					h('h1', { class: 'text-3xl font-bold text-gray-800 mb-2' },
						h('i', { class: 'fas fa-briefcase text-blue-800 mr-3' }), 'Mis Portafolios'
					),
					h('p', { class: 'text-gray-600' }, 'Muestra tus proyectos y logros profesionales')
				),
				h('div', { class: 'flex items-center space-x-4' },
					h('a', { href: '/html/portfolio/create.html', class: 'btn-primary text-white px-6 py-3 rounded-xl hover-lift flex items-center shadow-soft' },
						h('i', { class: 'fas fa-plus mr-2' }), 'Agregar Portafolio'
					)
				)
			)
		)
	);
}

function portfolioCard(p, onDeleted){
	const url = p.url_proyect || p.url_project || p.file_url || '';
	const pdfUrl = resolvePdfUrl(p.url_pdf);
	const id = p.id;
	const card = h('div', { class: 'card-enhanced hover-lift p-6 animate-slide-in' },
		h('div', { class: 'flex justify-between items-start' },
			h('div', { class: 'flex-1' },
				h('div', { class: 'flex items-start justify-between mb-4' },
					h('div', { class: 'flex-1' },
						h('h2', { class: 'text-xl font-semibold text-gray-800 mb-2' },
							h('i', { class: 'fas fa-folder-open text-blue-700 mr-2' }), p.title || 'Portafolio'
						),
						h('p', { class: 'text-gray-600 mb-4 leading-relaxed' }, p.description || ''),
						h('div', { class: 'flex items-center flex-wrap gap-4 mb-4' },
							url ? h('a', { href: url, target: '_blank', rel: 'noopener', class: 'flex items-center text-blue-600 hover:text-blue-800 transition-colors' }, h('i', { class: 'fas fa-globe mr-1' }), 'Ver Proyecto') : null,
							pdfUrl ? h('a', { href: pdfUrl, target: '_blank', rel: 'noopener', class: 'flex items-center text-purple-600 hover:text-purple-800 transition-colors' }, h('i', { class: 'fas fa-file-pdf mr-1' }), 'Ver PDF') : null
						)
					)
				)
			),
			h('div', { class: 'text-right flex flex-col items-end' },
				h('div', { class: 'flex space-x-2 mb-3' },
					h('a', { href: `/html/portfolio/edit.html?id=${encodeURIComponent(id)}`, class: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-xl hover-lift transition-all duration-300 text-sm font-medium shadow-soft' }, h('i', { class: 'fas fa-edit mr-1' }), 'Editar'),
					h('button', { type: 'button', class: 'bg-gradient-to-r from-red-800 to-red-900 text-white px-4 py-2 rounded-xl hover-lift transition-all duration-300 text-sm font-medium shadow-soft', onClick: async () => {
						if (!id) return;
						const ok = confirm('¿Estás seguro de eliminar este portafolio?');
						if (!ok) return;
						try { await deletePortfolio(id); onDeleted?.(card); } catch (e) { alert(e?.data?.message || e.message || 'No se pudo eliminar.'); }
					} }, h('i', { class: 'fas fa-trash mr-1' }), 'Eliminar')
				)
			)
		)
	);
	return card;
}

export async function mountPortfolios(root){
	if (!root) return;
	const { allowed } = await requireRole('unemployed');
	if (!allowed) return;
	root.innerHTML = '';
	// Header
	const header = headerBlock();
	root.appendChild(header);
	const container = h('div', { class: 'grid grid-cols-1 gap-6' });
	const loading = h('p', { class: 'text-slate-500' }, 'Cargando portafolios...');
	container.appendChild(loading);
	root.appendChild(container);

	try {
		const data = await listPortfolios();
		const items = getArray(data);
		container.innerHTML = '';
		if (!items.length) {
			const empty = h('div', { class: 'card-enhanced p-12 text-center animate-fade-in-up' },
				h('div', { class: 'w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4' }, h('i', { class: 'fas fa-briefcase text-3xl text-gray-400' })),
				h('h3', { class: 'text-xl font-semibold text-gray-800 mb-2' }, 'No tienes portafolios aún'),
				h('p', { class: 'text-gray-600 mb-6' }, 'Comienza a mostrar tus proyectos y logros profesionales.'),
				h('a', { href: '/html/portfolio/create.html', class: 'btn-primary text-white px-6 py-3 rounded-xl hover-lift inline-flex items-center' }, h('i', { class: 'fas fa-plus mr-2' }), 'Crear Primer Portafolio')
			);
			container.appendChild(empty);
			return;
		}
		for (const it of items) {
			const card = portfolioCard(it, (node) => node?.remove());
			container.appendChild(card);
		}
	} catch (e) {
		container.innerHTML = '';
		container.appendChild(h('p', { class: 'text-red-600' }, e?.data?.message || e.message || 'Error al cargar los portafolios'));
	}
}

export function autoMount(){ const el = document.querySelector('[data-page="portfolios"]'); if (el) mountPortfolios(el); }
