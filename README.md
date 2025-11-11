# Grafos

Visualizador y constructor interactivo de grafos para la materia Arquitectura Discreta.

## Descripción

Esta aplicación permite crear, visualizar y analizar grafos de manera intuitiva. Los usuarios pueden agregar nodos y conexiones, buscar el camino más corto entre dos nodos usando Dijkstra, y exportar la estructura del grafo.

## Características principales

- **Constructor visual de diagramas de red**: arrastrá y conectá componentes fácilmente.
- **Visualización animada de caminos**: muestra el camino más corto entre dos nodos con animación.
- **Selección de nodos por lista**: seleccioná los nodos de origen y destino desde un menú desplegable.
- **Exportación de datos**: descargá la estructura del grafo para su análisis o respaldo.
- **Modal de créditos**: muestra los autores y la facultad.

## Tecnologías utilizadas

- Next.js 14
- React 18
- TypeScript
- Cytoscape.js (visualización de grafos)
- Tailwind CSS

## Instalación y uso

1. Cloná el repositorio:
	```sh
	git clone https://github.com/FacuSB/Integrador-Arquitectura-Discreta.git
	cd Integrador-Arquitectura-Discreta
	```
2. Instalá las dependencias:
	```sh
	npm install
	# o
	pnpm install
	```
3. Iniciá la app en modo desarrollo:
	```sh
	npm run dev
	# o
	pnpm dev
	```
4. Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.



<details>
<summary><strong>Proceso de desarrollo (mostrar/ocultar)</strong></summary>

El desarrollo de la página se realizó utilizando Next.js y React, priorizando la experiencia visual y la facilidad de uso. Así fue el proceso y las decisiones técnicas principales:

1. **Diseño y estructura**  
	- Se definió un layout responsive usando Tailwind CSS, para que la app funcione bien tanto en escritorio como en mobile.
	- El panel de componentes y el área de trabajo se organizaron con Flexbox, permitiendo que se adapten según el tamaño de pantalla.

2. **Lógica de nodos y conexiones**  
	- Se crearon componentes reutilizables para los nodos y las conexiones.
	- El estado de los nodos y conexiones se maneja con React (`useState`), permitiendo agregar, mover, renombrar y eliminar nodos de forma dinámica.

3. **Visualización de grafos**  
	- Se integró Cytoscape.js para renderizar el grafo y animar el camino más corto.
	- Se implementó el algoritmo de Dijkstra en TypeScript para calcular el camino óptimo entre dos nodos seleccionados.

4. **Interactividad**  
	- Los selectores de nodos permiten elegir fácilmente el origen y destino para el cálculo del camino más corto.
	- Los botones y modales (como el de créditos) se diseñaron para ser intuitivos y accesibles.

5. **Exportación y modularidad**  
	- Se agregó una función para exportar los datos del grafo, facilitando su uso en otros contextos.
	- El código se organizó en componentes y hooks para mantenerlo limpio y fácil de mantener.

</details>


- Mariano Cordeiro
- Blanco Facundo
- Medina Gabriel
- Vanni Giovani
- Mateo Difiore
- Jara Fabricio 

Universidad de la Cuenca del Plata

---

¡Contribuciones y sugerencias son bienvenidas!