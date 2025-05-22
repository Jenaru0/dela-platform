# Alcance congelado – MVP v1

_Reunión de equipo: 20-may-2025 – todas las partes acordaron este alcance._

| RF  | Descripción                                    | ¿Entra MVP? | Motivo (una línea)                      |
| --- | ---------------------------------------------- | ----------- | --------------------------------------- |
| 01  | Catálogo CRUD (admin)                          | ✅ Sí       | Sin catálogo no hay ventas.             |
| 02  | Búsqueda y filtro básico                       | ✅ Sí       | Necesario para UX mínima.               |
| 03  | Registro / Login (JWT)                         | ✅ Sí       | Imprescindible para pedidos.            |
| 04  | Carrito + subtotal                             | ✅ Sí       | Núcleo del flujo de compra.             |
| 05  | Checkout + pago con Stripe (tarjeta)           | ✅ Sí       | Permite cobrar sin WhatsApp.            |
| 06  | Órdenes & tracking (PENDING/SHIPPED/DELIVERED) | ✅ Sí       | El cliente revisa su compra.            |
| 07  | Inventario básico (+ ajuste manual)            | ✅ Sí       | Evita sobre-venta.                      |
| 08  | Notificación e-mail pedido + cambio de estado  | ✅ Sí       | Confirma compra y despacho.             |
| 09  | Integración Stripe                             | ✅ Sí       | Único tercero indispensable en v1.      |
| 10  | Multilingüe                                    | ❌ No       | Clientela 99 % español; se aplaza.      |
| 11  | Pantalla “Mi perfil”                           | ❌ No       | Valor agregado posterior.               |
| 12  | Roles finos (más de Admin/Cliente)             | ❌ No       | No necesario para v1.                   |
| 13  | Social Login (Google / Facebook)               | ❌ No       | Nice-to-have; difiere.                  |
| 14  | Push / Web Notifications                       | ❌ No       | Requiere Service Worker; difiere.       |
| 15  | Validación formularios (HTML5 + Zod/Yup)       | ✅ Sí       | Evita datos inválidos en producción.    |
| 16  | Autosuggest / búsqueda avanzada                | ❌ No       | Se planifica para v1.2 con Meilisearch. |
| 17  | Auditoría detallada                            | ❌ No       | Logs básicos bastan por ahora.          |
| 18  | Gestión usuarios (UI admin)                    | ❌ No       | En v1 se maneja vía base de datos.      |
| 19  | Reportes CSV / gráficas ventas                 | ❌ No       | Difiere hasta que existan datos reales. |

### RNF que **sí** son obligatorios en MVP

| RNF             | Meta mínima                             |
| --------------- | --------------------------------------- |
| Rendimiento API | <= 2 s P95                              |
| Seguridad       | HTTPS + 0 vulns críticas (OWASP ZAP)    |
| Uptime          | 99 % (dev tier)                         |
| Back-up         | Dump diario en OCI Object Storage       |
| Observabilidad  | Logs Loki + métricas básicas Prometheus |

> Cualquier funcionalidad no listada como ✅ **no se codifica** hasta que el MVP esté en producción estable.
