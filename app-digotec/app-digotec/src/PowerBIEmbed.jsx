import React from 'react';
import { BarChart3 } from 'lucide-react';

const PowerBIEmbed = () => {
  return (
    <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-center">
      <BarChart3 size={48} className="mb-4 text-gray-400" />
      <h3 className="mb-2 text-lg font-medium text-gray-900">Power BI Dashboard Embebido</h3>
      <p className="max-w-md text-sm text-gray-500">
        Esta sección está preparada para la integración mediante <code>powerbi-client-react</code>.
        En un entorno corporativo (M365/SPFx), se inyectaría aquí el <b>embedUrl</b> y el <b>accessToken</b> mediante Azure AD (Entra ID).
        *Nota: La publicación pública está bloqueada por políticas del Tenant.*
      </p>
    </div>
  );
};

export default PowerBIEmbed;