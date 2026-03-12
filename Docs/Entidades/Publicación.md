Entidad para representar los productos
###### **Atributos**

- **Titulo**
	- String, Required
- **Imágenes**
	- List\<string>, Required, Formato URL
- **Descripción**
	- String, Required
- **Usuario**
	- Entidad [[Usuario]], Solo usuarios vendedores ( type 2 )
- Mascota
	- Entidad [[Mascota]], Required
- Disponibilidad
	- Date, Required
- Cantidad
	- Int, Required (>1)