import pandas as pd
import numpy as np

# 1. CARGA DE DATOS
print("--- INICIANDO PROCESO DE DATOS ---")
df = pd.read_csv('Digotec_Prueba_Analitica_Automatizacion_Dataset.tsv', sep='\t')

# 2. LIMPIEZA BÁSICA
# Eliminar filas duplicadas exactas
df_clean = df.drop_duplicates().copy()

# Normalizar columnas de texto
columnas_texto = ['segmento_cliente', 'ciudad', 'producto', 'categoria_consumo', 'canal', 'estado_producto']
for col in columnas_texto:
    df_clean[col] = df_clean[col].astype(str).str.strip().str.title()
    df_clean[col] = df_clean[col].replace('Nan', np.nan)

# Tratamiento de Nulos y Fechas
df_clean['ciudad'] = df_clean['ciudad'].fillna('Desconocida')
df_clean['saldo_producto'] = df_clean['saldo_producto'].fillna(0)
df_clean['cupo_credito'] = df_clean['cupo_credito'].fillna(0)
df_clean['categoria_consumo'] = df_clean['categoria_consumo'].fillna('No Aplica')

df_clean['fecha_vencimiento'] = pd.to_datetime(df_clean['fecha_vencimiento'], errors='coerce')
df_clean['fecha_movimiento'] = pd.to_datetime(df_clean['fecha_movimiento'], errors='coerce')

# Tratamiento de Edades (Outliers)
df_clean.loc[(df_clean['edad'] < 18) | (df_clean['edad'] > 100), 'edad'] = np.nan
df_clean['edad'] = df_clean['edad'].fillna(df_clean['edad'].median())

# 3. CORRECCIÓN DE INCONSISTENCIAS (Categorías)
diccionario_categorias = {
    'Tech': 'Technology',
    'Streamng': 'Streaming',
    'Super Market': 'Supermarket',
    'Travels': 'Travel'
}
df_clean['categoria_consumo'] = df_clean['categoria_consumo'].replace(diccionario_categorias)

# 4. CREACIÓN DE VISTAS ANALÍTICAS (Corregidas para Power BI)
# A) Info estática del cliente (sin duplicar)
info_cliente = df_clean.groupby('cliente_id').agg(
    nombre_cliente=('nombre_cliente', 'first'),
    edad=('edad', 'first'),
    ingreso_estimado=('ingreso_estimado', 'first'),
    ciudad=('ciudad', 'first'),
    segmento_cliente=('segmento_cliente', 'first')
).reset_index()

# B) Saldos y cupos reales (Eliminamos transacciones duplicadas para ver solo los productos reales del cliente)
productos_unicos = df_clean.drop_duplicates(subset=['cliente_id', 'producto'])
saldos_cliente = productos_unicos.groupby('cliente_id').agg(
    total_saldo=('saldo_producto', 'sum'),
    total_cupo=('cupo_credito', 'sum'),
    cantidad_productos=('producto', 'nunique')
).reset_index()

# Unimos info del cliente con sus saldos reales
vista_cliente = pd.merge(info_cliente, saldos_cliente, on='cliente_id')

# C) Pivotear el consumo transaccional
consumo_pivot = df_clean.pivot_table(
    index='cliente_id',
    columns='categoria_consumo',
    values='monto_consumo',
    aggfunc='sum',
    fill_value=0
).reset_index()

# Unimos todo
vista_analitica = pd.merge(vista_cliente, consumo_pivot, on='cliente_id', how='left')

# Calculamos consumo total (excluyendo 'No Aplica')
categorias_validas = [col for col in consumo_pivot.columns if col not in ['cliente_id', 'No Aplica']]
vista_analitica['consumo_total'] = vista_analitica[categorias_validas].sum(axis=1)


# D) Regla de Segmentación Conductual ("Lovers")
def definir_segmento_conductual(row):
    if row['consumo_total'] == 0:
        return 'Sin Consumo'

    if 'Travel' in row and (row['Travel'] / row['consumo_total']) > 0.5:
        return 'Travel Lover'
    elif 'Food' in row and (row['Food'] / row['consumo_total']) > 0.5:
        return 'Food Lover'
    elif 'Technology' in row and (row['Technology'] / row['consumo_total']) > 0.5:
        return 'Tech Lover'
    elif 'Streaming' in row and (row['Streaming'] / row['consumo_total']) > 0.5:
        return 'Streaming Lover'
    else:
        return 'General Shopper'


vista_analitica['segmento_conductual'] = vista_analitica.apply(definir_segmento_conductual, axis=1)

print("\n--- DISTRIBUCIÓN FINAL DE SEGMENTOS ---")
print(vista_analitica['segmento_conductual'].value_counts())

# 5. EXPORTACIÓN PARA POWER BI (Formato Regional Latino/Europeo)
df_clean.to_csv('dataset_limpio_transacciones.csv', index=False, sep=';', decimal=',')
vista_analitica.to_csv('dataset_limpio_clientes.csv', index=False, sep=';', decimal=',')

print(
    "\nArchivos exportados exitosamente. Ahora ve a Power BI, abre Power Query (Transformar datos) y cambia el delimitador del origen a Punto y Coma (;).")




# 6. EXPORTACIÓN PARA LA APP EN REACT (JSON)
vista_analitica.to_json('datos_react.json', orient='records')
print("Archivo JSON para React generado.")