import '../css/app.css';
import { configureAuth, setAuthToken } from './api/http.js';
import { autoMount as mountJobOffers } from './pages/jobOffersPage.js';
import { autoMount as mountJobOfferDetail } from './pages/jobOfferDetailPage.js';
import { autoMount as mountJobOfferCreate } from './pages/jobOfferCreatePage.js';
import { autoMount as mountJobOfferEdit } from './pages/jobOfferEditPage.js';
import { autoMount as mountClassifieds } from './pages/classifiedsPage.js';
import { autoMount as mountClassifiedDetail } from './pages/classifiedDetailPage.js';
import { autoMount as mountClassifiedCreate } from './pages/classifiedCreatePage.js';
import { autoMount as mountTrainings } from './pages/trainingsPage.js';
import { autoMount as mountFavorites } from './pages/favoritesPage.js';
import { autoMount as mountMessages } from './pages/messagesPage.js';
import { autoMount as mountMessageForm } from './pages/messageFormPage.js';
import { autoMount as mountNotifications } from './pages/notificationsPage.js';
import { autoMount as mountPortfolios } from './pages/portfoliosPage.js';
import { autoMount as mountPortfolioCreate } from './pages/portfolioCreatePage.js';
import { autoMount as mountPortfolioEdit } from './pages/portfolioEditPage.js';
import { autoMount as mountJobApplications } from './pages/jobApplicationsPage.js';
import { autoMount as mountJobApplicationsUnemployed } from './pages/jobApplicationsUnemployedPage.js';
import { autoMount as mountJobApplicationsCompany } from './pages/jobApplicationsCompanyPage.js';
import { autoMount as mountJobApplicationCreate } from './pages/jobApplicationCreatePage.js';
import { autoMount as mountAuthLogin } from './pages/loginPage.js';
import { autoMount as mountAuthRegister } from './pages/registerPage.js';
import { autoMount as mountAuthForgot } from './pages/forgotPasswordPage.js';
import { autoMount as mountAuthReset } from './pages/resetPasswordPage.js';
import { autoMount as mountCompanyForm } from './pages/companyFormPage.js';
import { autoMount as mountSettings } from './pages/settingsPage.js';
import { autoMount as mountHome } from './pages/homePage.js';
import { autoMount as mountUnemployedForm } from './pages/unemployedFormPage.js';
import { autoMount as mountInterviewsIndex } from './pages/interviewsPage.js';
import { autoMount as mountAdminClassifiedsIndex } from './pages/adminClassifiedsPage.js';
import { autoMount as mountAdminJobOffersIndex } from './pages/adminJobOffersPage.js';
import { autoMount as mountAdminDashboard } from './pages/adminDashboardPage.js';
import { autoMount as mountAdminTrainingsIndex } from './pages/adminTrainingsPage.js';
import { autoMount as mountAdminTrainingEdit } from './pages/adminTrainingEditPage.js';
import { autoMount as mountAdminTrainingCreate } from './pages/adminTrainingCreatePage.js';
import './header/nav.js';
import './adminLayout.js';
import './components/ui.js';

// Restaurar modo de autenticación preferido (bearer por token o cookie por sesión)
try {
  const savedMode = localStorage.getItem('auth_mode');
  const mode = savedMode === 'cookie' ? 'cookie' : 'bearer';
  configureAuth({ mode });
  if (mode === 'bearer') {
    const saved = localStorage.getItem('auth_token');
    if (saved) setAuthToken(saved);
  }
  if (mode === 'cookie') {
    // Asegura que no quede un token obsoleto de sesiones anteriores
    setAuthToken(undefined);
  }
} catch {}

console.info('Frontend bundle cargado.');

// Auto-montajes protegidos
try { mountJobOffers(); } catch (e) { console.warn('Error montando lista de ofertas:', e); }
try { mountJobOfferDetail(); } catch (e) { console.warn('Error montando detalle de oferta:', e); }
try { mountJobOfferCreate(); } catch (e) { console.warn('Error montando creación de oferta:', e); }
try { mountJobOfferEdit(); } catch (e) { console.warn('Error montando edición de oferta:', e); }
try { mountClassifieds(); } catch (e) { console.warn('Error montando clasificados:', e); }
try { mountClassifiedDetail(); } catch (e) { console.warn('Error montando detalle de clasificado:', e); }
try { mountClassifiedCreate(); } catch (e) { console.warn('Error montando creación de clasificado:', e); }
try { mountTrainings(); } catch (e) { console.warn('Error montando capacitaciones:', e); }
try { mountFavorites(); } catch (e) { console.warn('Error montando favoritos:', e); }
try { mountMessages(); } catch (e) { console.warn('Error montando mensajes:', e); }
try { mountMessageForm(); } catch (e) { console.warn('Error montando formulario de mensaje:', e); }
try { mountNotifications(); } catch (e) { console.warn('Error montando notificaciones:', e); }
try { mountPortfolios(); } catch (e) { console.warn('Error montando portafolios:', e); }
try { mountPortfolioCreate(); } catch (e) { console.warn('Error montando creación de portafolio:', e); }
try { mountPortfolioEdit(); } catch (e) { console.warn('Error montando edición de portafolio:', e); }
try { mountJobApplications(); } catch (e) { console.warn('Error montando postulaciones:', e); }
try { mountJobApplicationsUnemployed(); } catch (e) { console.warn('Error montando postulaciones desempleado:', e); }
try { mountJobApplicationsCompany(); } catch (e) { console.warn('Error montando postulaciones empresa:', e); }
try { mountJobApplicationCreate(); } catch (e) { console.warn('Error montando crear postulación:', e); }
try { mountAuthLogin(); } catch (e) { console.warn('Error montando auth login:', e); }
try { mountAuthRegister(); } catch (e) { console.warn('Error montando auth register:', e); }
try { mountAuthForgot(); } catch (e) { console.warn('Error montando auth forgot:', e); }
try { mountAuthReset(); } catch (e) { console.warn('Error montando auth reset:', e); }
try { mountCompanyForm(); } catch (e) { console.warn('Error montando company form:', e); }
try { mountSettings(); } catch (e) { console.warn('Error montando settings:', e); }
try { mountHome(); } catch (e) { console.warn('Error montando home:', e); }
try { mountUnemployedForm(); } catch (e) { console.warn('Error montando unemployed form:', e); }
try { mountInterviewsIndex(); } catch (e) { console.warn('Error montando entrevistas index:', e); }
try { mountAdminClassifiedsIndex(); } catch (e) { console.warn('Error montando admin classifieds index:', e); }
try { mountAdminJobOffersIndex(); } catch (e) { console.warn('Error montando admin job offers index:', e); }
try { mountAdminDashboard(); } catch (e) { console.warn('Error montando admin dashboard:', e); }
try { mountAdminTrainingsIndex(); } catch (e) { console.warn('Error montando admin trainings index:', e); }
try { mountAdminTrainingEdit(); } catch (e) { console.warn('Error montando admin training edit:', e); }
try { mountAdminTrainingCreate(); } catch (e) { console.warn('Error montando admin training create:', e); }

// Manejo global de promesas no capturadas (útil en navegadores)
window.addEventListener('unhandledrejection', (event) => {
  const err = event.reason;
  const msg = (err?.message || '').toString().toLowerCase();
  if (err && (err.code === 'AUTH_REQUIRED' || err.status === 401 || msg === 'auth required')) {
    // Evitar que el navegador muestre el error como uncaught
    event.preventDefault?.();
    console.info('[API] Autenticación requerida (401). Configura token o modo cookie.');
    // En esta versión estática no redirigimos; solo informamos.
    return;
  }
  console.error('Uncaught (in promise):', err);
});
