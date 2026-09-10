# Prueba Técnica: Analítica y Automatización Digital
**Candidato:** Jeisson Ventura

Este repositorio contiene la solución técnica integral para el ciclo de vida de los datos: desde la ingeniería de datos (Python) y visualización (Power BI), hasta el desarrollo de una interfaz web (React) preparada para entornos corporativos (Microsoft 365).

## 1. Preparación y Análisis de Datos (Python)
**Supuestos y Reglas de Limpieza:**
* Se eliminaron 113 registros duplicados exactos para evitar alteraciones en los KPIs.
* Los nulos en `cupo_credito` se imputaron como $0 asumiendo que corresponden a productos no crediticios.
* Se detectaron y corrigieron errores tipográficos intencionales en las categorías (ej. *Streamng*, *Tech*) utilizando diccionarios de estandarización.

**Criterio de Segmentación Conductual ("Lovers"):**
Se creó un modelo de concentración de gasto. Un cliente es catalogado como `Lover` (Travel, Food, Tech, Streaming) **si y solo si más del 50% de su gasto total registrado está dirigido a esa única categoría**. Si su gasto es diversificado, se cataloga como `General Shopper`.

**Insights Accionables:**
1. **Alta Tasa de Inactividad:** 545 clientes (24.7% de la cartera) tienen productos pero no registran consumos. *Acción:* Ejecutar campaña de reactivación transaccional.
2. **Nicho de Alto Valor:** Los "Lovers" (Food, Travel, Tech, Streaming) representan el 16% de los usuarios, pero con un gasto ultra-concentrado. *Acción:* Ideales para ofrecer tarjetas de crédito Co-Branded.
3. **Dominio Generalista:** 1,302 usuarios diversifican su gasto. *Acción:* Programas genéricos de Cashback asegurarán mayor retención para este bloque masivo.

## 2. Aplicación React y Ecosistema M365
**Instrucciones para ejecutar la aplicación web:**
1. Navegar a la carpeta del frontend: `cd app-digotec`
2. Instalar dependencias: `npm install`
3. Iniciar el servidor local: `npm run dev`
4. Abrir en el navegador: `http://localhost:5173` (Usar cualquier credencial en el login simulado).

## 3. Integración y Automatización (SPFx y Power Automate)
**A. Adaptación a SharePoint Framework (SPFx):**
Para llevar la solución React a M365, se empaquetaría el componente `Dashboard.jsx` como un *Web Part* usando Yeoman. El archivo JSON sería reemplazado por la API de SharePoint o Dataverse. El Power BI embebido inyectaría el `embedUrl` gestionando el Token de Acceso mediante Azure AD (Entra ID).

**B. Automatización Propuesta:**
Se propone un flujo de **"Alerta Temprana de Vencimientos"** en Power Automate:
* **Trigger:** Programado (Diario 8:00 AM).
* **Acción:** Consulta productos con `fecha_vencimiento` a 30 días.
* **Notificación:** Envía una *Adaptive Card* por Microsoft Teams al Oficial de Cuenta con los datos del cliente y un botón de "Contactar", priorizando clientes VIP o multiproducto.
