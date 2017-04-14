# NETI-v2.0

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f43008579a464783716d)

#### API Endpoint: https://5lmeesr8wg.execute-api.us-east-1.amazonaws.com/EGR323
#### Firebase Endpoint: https://neti-v2.firebaseio.com/

## API Resources
- ##### [/color](#color) : Assists with adding/manipulating color types.
- ##### [/consistency](#consistency) : Assists with adding/manipulating consistency types.
- ##### [/container](#container) : Assists with adding/manipulating container types.
- ##### [/drug](#drug) : Assists with adding/manipulating drug types.

# <a id="color"></a>/color
## POST
Calling this resource will create a new color in the database.</br>
**Body Example:**
```
{
	"hex": "#0000FF",
	"name": "Blue"
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Manipulation on color '#0000ff' successful."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "Both a hexidecimal color and a name must be provided."
}
```
## PUT
Calling this resource will manipulate an existing color in the database.</br>
**Body Example:**
```
{
	"hex": "0000FF",
	"name": "Blue AF"
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Manipulation on color '#0000ff' successful."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "Both a hexidecimal color and a name must be provided."
}
```
## DELETE
Calling this resource will remove an existing color from the database.</br>
**Body Example:**
```
{
	"hex": "0000FF"
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Color '#0000ff' successfully removed."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "No hex code provided."
}
```

# <a id="consistency"></a>/consistency
## POST
Calling this resource will create a new consistency type in the database.</br>
**Body Example:**
```
{
	"name": "Liquid",
	"description": "You know, like water or rain or melted ice..."
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Manipulation on consistency 'Liquid' successful."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "The name of the consistency must be provided."
}
```
## PUT
Calling this resource will manipulate an existing consistency type in the database.</br>
**Body Example:**
```
{
	"id": "551d6320-20dd-11e7-a857-3fc6bf5f9b55",
	"name": "Liquid",
	"description": "A substance that flows freely but is of constant volume, having a consistency like that of water or oil."
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Manipulation on consistency 'Liquid' successful."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "The name of the consistency must be provided."
}
```
## DELETE
Calling this resource will remove an existing consistency type from the database.</br>
**Body Example:**
```
{
	"id": "551d6320-20dd-11e7-a857-3fc6bf5f9b55"
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Consistency '551d6320-20dd-11e7-a857-3fc6bf5f9b55' successfully removed."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "No id provided."
}
```

# <a id="container"></a>/container
## POST
Calling this resource will create a new container type in the database.</br>
**Body Example:**
```
{
	"name": "Capsule",
	"description": "Used for drugs and/or things people think will be important eons from now."
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Manipulation on container 'Capsule' successful."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "The name of the container must be provided."
}
```
## PUT
Calling this resource will manipulate an existing container type in the database.</br>
**Body Example:**
```
{
	"id": "823792a0-20e1-11e7-8e4c-e1657a2e5d8a",
	"name": "Capsule",
	"description": "A small case or container, especially a round or cylindrical one."
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Manipulation on container 'Capsule' successful."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "The name of the container must be provided."
}
```
## DELETE
Calling this resource will remove an existing container type from the database.</br>
**Body Example:**
```
{
	"id": "823792a0-20e1-11e7-8e4c-e1657a2e5d8a"
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Container '823792a0-20e1-11e7-8e4c-e1657a2e5d8a' successfully removed."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "No id provided."
}
```

# <a id="drug"></a>/drug
## POST
Calling this resource will create a new drug type in the database.</br>
**Body Example:**
```
{
  "name": "Memes",
  "description": "Not even once..."
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Manipulation on drug 'Memes' successful."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "The name of the drug must be provided."
}
```
## PUT
Calling this resource will manipulate an existing drug type in the database.</br>
**Body Example:**
```
{
  "id": "1c8b1310-206d-11e7-8d01-f5d34a2557c2",
  "name": "Memes",
  "description": "Not even once...",
  "appearances": [
    {
      "color_id": "2bd6cb",
      "consistency_id": "35155a70-1fab-11e7-a9c7-db6ec2b89610",
      "container_id": "254f8bc0-201d-11e7-9e5d-db4051518ddf"
    }
  ]
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Manipulation on drug 'Memes' successful."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "Field 'color_id' not valid."
}
```
## DELETE
Calling this resource will remove an existing drug type from the database.</br>
**Body Example:**
```
{
  "id": "1c8b1310-206d-11e7-8d01-f5d34a2557c2"
}
```
**Successful Response Example:**
```
{
  "status": 200,
  "message": "Successfully deleted drug 1c8b1310-206d-11e7-8d01-f5d34a2557c2."
}
```
**Unsuccessful Response Example:**
```
{
  "status": 400,
  "message": "No id provided."
}
```
