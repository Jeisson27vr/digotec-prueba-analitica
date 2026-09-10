## 4. Integración y Automatización (Ecosistema Microsoft 365)

**A. Adaptación a SharePoint Framework (SPFx)**
Para llevar esta solución construida en React a un entorno corporativo de SharePoint, el proceso sería:
1. Crear un proyecto SPFx usando el generador de Yeoman (`@microsoft/generator-sharepoint`).
2. Aislar el componente `Dashboard.jsx` y empaquetarlo como un **Web Part** de lado del cliente.
3. Reemplazar el archivo JSON estático por llamadas a la API de SharePoint (SPHttpClient) o MS Graph API para consumir los datos de forma dinámica.
4. Para el reporte de Power BI, se utilizaría el paquete `powerbi-client-react`, inyectando el `embedUrl` y gestionando el Token de Acceso mediante Azure AD (Entra ID) para respetar las políticas de seguridad del inquilino.

**B. Almacenamiento, Permisos y Configuración**
En un escenario corporativo real de alto volumen:
*   **Datos transaccionales:** No vivirían en SharePoint. Se almacenarían en Azure SQL Database o Dataverse, y la aplicación web los consumiría mediante una API intermedia o directamente en Power BI.
*   **Parámetros de Configuración (Filtros, Diccionarios):** Se almacenarían en **Listas de SharePoint**, lo que permitiría a los usuarios de negocio (Key Users) modificar las categorías o segmentaciones sin necesidad de tocar el código fuente.
*   **Permisos y Seguridad:** Se gestionaría 100% mediante grupos de Microsoft Entra ID (Azure AD), aplicando Row-Level Security (RLS) en Power BI para que un gerente regional de "Guayaquil", por ejemplo, solo vea los clientes de su ciudad al iniciar sesión.

**C. Propuesta de Automatización (Power Automate)**
Se propone un flujo de **"Alerta Temprana de Vencimientos"** para mejorar la retención de clientes:
1. **Trigger:** Flujo programado (Scheduled Cloud Flow) que se ejecuta todos los días a las 8:00 AM.
2. **Acción 1 (Obtener Datos):** Consulta la base de datos o el dataset de Power BI buscando productos cuya `fecha_vencimiento` sea igual a `Hoy + 30 días`.
3. **Acción 2 (Condición):** Filtra solo a los clientes de segmentos de alto valor (VIP, Premium) o a los clientes multiproducto.
4. **Acción 3 (Notificación):** Envía una **Adaptive Card** automatizada por Microsoft Teams al Oficial de Cuenta correspondiente con el nombre del cliente, el saldo pendiente y un botón de "Llamar ahora", o envía un correo automatizado al cliente recordando la renovación de su producto.