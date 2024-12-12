# AWS with React

## Temas

- DynamoDB
- Lambda Functions
- Gateway API

### Instrucciones

#### 1. Set up and create accounts

- Create a new project

```
npx create-react-app aws-learning --use-npm
```

- Create [github project](https://github.com/)

```
git init
git add *
git status
git commit -m "inictial commit"
```

- Crear aws account [**aws management console**](console.aws.amazon.com/console/)

email: email
password: password

- Conectar tu app con AWS Amplify

busca Amplify en el buscador de la consola -> implementar una aplicacion -> selecionar github y dar authorizacion -> seleccionar repositorio

salve el link de su projecto

> Cada vez que update project and push to github se actualizara automaticamente en Amplify

#### 2. Codigo en repositorio

```
  class App extends React.Component {
   render{}
   return(..react code...)
  }
```

##### Create src/components folder to add page element

- Header.js
- Main.js
- Footer.js

##### create src/components/data forlder to store json files

- menu_links.json (crear un json por cada base de dator)

```
[
 {
  "class": "info",
  "href": "#hotel info",
  "text": "info"
 },
]
```

- en el componente js importar datos desde json

```
import menuLinksData from './sor...'

{
 menuLinksData.map((link) =>
 <li className=(`icon ${link.class})>..etc)
}
```

- create json files for each part of project that request data iteration

#### 3. Download aws

```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

#### 4. get user AWS

>I am panel -> users -> add user
proporciones acceso de usuario a la consola de administracion AWS -> quiero crear un usuario IAM
>attach existing policy directly -> dynamoDB
dinamodb full acces
> descargar archivo.csv (esta contrasena es para que el ususario se pueda logear en la consola de AWS en internet, no es para el AWS cli)

- hay que asignarle las claves de acceso para que el usuario pueda usar la consola AWS cli

>IAM -> Users -> nombreDelUsuario -> en resumen seleccionar crear calce de acceso

clave de acceso: secreta
clave de acceso secreta: secreta

- configure AWS console cli

```
aws configure
```

username: usernema file
password: pasword file
default region name: us-east-1
dafault output format: json

- para verificar que se creo correctamente

```
aws sts get-caller-identity
```

- instal aws sdk (in your project)

```
npm install aws-sdk
```

- create src/script folder to add table db
- copy the files to create tables in database script src/scripts/CreateMenuLinksTable.js

- run file to crete db with node

```
node CreateMenu...
```

- si aparece un error por permisions puedes crear las tablas directamente en la pagina de la consola AWS dynamoDB

#### 5. Add a LAMBDA

- create a role in IAM

>roles -> create role -> entidad de confianza: Servicio AWS -> caso de uso: Lambda

>look for :
lambda basic execution role
dynamoDB full access

>crear un nombre para el rol : LambdaDynamoRole

- Load dynamo data

>look for Lambda -> function -> create function -> Author from scratch -> put a name (like getServices) -> use existed role -> select our role created before -> create function

- paste code:

```
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "MenuLinks";

export const handler = async (event) => {

  try {
    const data = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
    console.log('Datos obtenidos:', data.Items);

    return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Datos obtenidos con éxito',
                data: data.Items
            }),
        };

  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
          message: 'Hubo un error al obtener los datos',
          error: error.message
      }),
  };
  }
};
```

- Press deploy before testing
- press create test event -> give a name like GetServicesTest -> delete keys and values { } -> press save

#### 6. Api Gateway - buscar en buscador AWS

- create API -> HTTP API ->select a name: LondonHotelAPI -> create as default

- con el punto de enace predeterminado se puede ver la respuesta (link URL API)

> Routes -> create -> select http protocole: GET -> name it: /services -> create -> select route -> attach integration ->  create and asociate one -> destino de integracion -> select Lambda function ->select region -> select lambda function: getServices -> give a description for remember rout reason -> create

> deploy -> click create new stage (nueva etapa) -> give a name: Production -> give a description -> create

> try again deploy -> select created stage -> give a desciption -> deploy to stage

> select stages to look the new stage

- make changes in your dynamoDB data to be sure informaiton ins updating correcting in API endopoints

#### 7. Add useState and useEffect to manage data

- Header.js:

vamos a cambiar el import links desde el archivo .json por el http request de la API

```
const [menuLinksData, setMenuLinksData] = useState([]);

  const loadMenuLinksData = async() => {
    // Query the API Gateway
    const resp = await fetch('https://a6lnno41t7.execute-api.us-east-1.amazonaws.com/Production/menu_links');
    let jsonData = await resp.json();

    // Assign response data to our state variable
    setMenuLinksData(jsonData);
  }

  useEffect(() => {
    // Load the menu links data from the API Gateway
    loadMenuLinksData();
  }, []);
```

#### 8. Manage CORS block error

- API Gateway -> cors -> configurar -> access-controll-allow-origen: * -> guardar -> deploy

>This is unsafe, so you should apply some authorization and autentication
otra opcion seria solo dar permiso a tu url del projecto

##### Refactor code, repeting code create a general function for all the data request

### RECURSOS DE AWS DOC

- Para crear dynamo table, lambda and CRUD fuction

[aws tutorial](https://docs.aws.amazon.com/es_es/apigateway/latest/developerguide/http-api-dynamo-db.html)