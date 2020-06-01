---
title: AWS Amplify GraphQL API with a React TypeScript Frontend
date: '2020-06-01'
description: 'Setup an AWS Amplify GraphQL API and consume it in a React Frontend TypeScript App. Improve type-safety for GraphQL calls and reduce boilerplate code'
---

## Introduction

[AWS Amplify](https://aws.amazon.com/amplify/) is a development platform for mobile and web applications. It is built-in Amazon Web Services (AWS) and scaffolds different AWS Services, like e.g Lambda functions, Cognito User Pools and an AppSync GraphQL API. This takes out the pain of manually setting up an AWS Infrastructure for a mobile an web applications, resulting in faster development speed. Amplify even has an own [documentation site](https://docs.amplify.aws/) and is [open source](https://github.com/aws-amplify)

This post will show you how to setup a GraphQL API with TypeScript code generation and how to use it in a React frontend application.

## AWS Account

Since Amplify is an AWS service it is required to sign in to the [AWS Console](https://console.aws.amazon.com/console). If you don't have an account, create one. Note: A credit card is required. But due to the pandemic, [AWS Educate](https://aws.amazon.com/education/awseducate/) was introduced so you may be able to signup for an account without a credit card required. However, this tutorial will not cost anything when published to the cloud.

## Setup React project

For the React frontend we will use a simple Create React App (CRA):
Run these CLI commands to create it and add the Amplify library

```shell
npx create-react-app amplify-typescript-demo --template typescript
cd amplify-typescript-demo
npm install --save aws-amplify
```

## Setup Amplify

Make sure, the [Amplify CLI](https://docs.amplify.aws/cli) is globally installed and configured.
The official documentation describes it very well and even has a video: [Install and configure Amplify CLI](https://docs.amplify.aws/cli/start/install#pre-requisites-for-installation)

After the CLI is configured properly, we can initialize Amplify in our project:

```shell
amplify init
```

This command wil initialize Amplify inside our project and it needs some information. Since we have a basic CRA App, we can simply just press enter and continue with the default options:

```shell
 Enter a name for the project `amplifytypescriptdem`
 Enter a name for the environment `dev`
 Choose your default editor: `Visual Studio Code`
 Choose the type of app that you're building `javascript`
 What javascript framework are you using `react`
 Source Directory Path: `src`
 Distribution Directory Path: `build`
 Build Command: `npm run-script build`
 Start Command: `npm run-script start`
 Do you want to use an AWS profile? `Yes`
 Please choose the profile you want to use `amplify-workshop-use`
```

## Add a GraphQL API

Now the GraphQL API can be added by running:

```shell
amplify init
```

This will starty by asking some questions:

```shell
 Please select from one of the below mentioned services: `GraphQL`
 Provide API name: `DemoAPI`
 Choose the default authorization type for the API: `API key`
 Enter a description for the API key: My Demo API
 After how many days from now the API key should expire (1-365): `7`
 Do you want to configure advanced settings for the GraphQL API: `No, I am done.`
 Do you have an annotated GraphQL schema? `No`
 Do you want a guided schema creation? `Yes`
 What best describes your project: `Single object with fields (e.g., “Todo” with ID, name, description)`
 Do you want to edit the schema now? `No`
```

This will generate a GraphQL API. Open `amplify/backend/api/DemoAPI/schema.graphql` to view the model.
This should contain a basic ToDo model:

```json
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```

### Mock and test the API

The API is ready to be tested! We don't have to configure any Lambda functions or AppSync manually. Everything's managed by Amplify.
To test the API we don't even have to deploy it in the cloud. Amplify has the ability to mock the whole API locally:

```shell
amplify mock api
```

Again, this will also ask some questions. And here comes the TypeScript part. This call will auto-generate TypeScript models for our React app. Simply choose `typescript` and go ahead with the default options:

```shell
 Choose the code generation language target `typescript`
 Enter the file name pattern of graphql queries, mutations and subscriptions `src/graphql/**/*.ts`
 Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions `Yes`
 Enter maximum statement depth [increase from default if your schema is deeply nested] `2`
 Enter the file name for the generated code `src/API.ts`
 Do you want to generate code for your newly created GraphQL API `Yes`
```

Finally, you should get a message with the local address on which the API is running:

```shell
AppSync Mock endpoint is running at http://192.168.0.143:20002
```

Open that address in the browser and you should see GraphiQL.

#### Create and list ToDos

Here are some Mutations and Queries to create and test demo data:

```json
mutation CreateTodo {
  createTodo(input: {
    name: "Blog Post",
    description: "Write a Blog Post about Amplify"})
  {
    description
    name
  }
}

mutation CreateTodo2 {
  createTodo(input: {
    name: "Dinner",
    description: "Buy groceries and cook dinner"})
  {
    description
    name
  }
}

query ListTodos {
  listTodos {
    items {
      name
      description
    }
  }
}
```

## Use the API in the React app

First step is to import Amplify and configure it. The `config` object is imported from `./aws-exports`. This file is generated by Amplify and should not be edited manually or pushed to e.g. GitHub!

```js
import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);
```

### Wrap Amplify API.graphql

Amplify provides a functionality to consume the GraphQL API, so you don't have to use another GraphQL Client like Apollo-Client.
Just create a small generic wrapper for it to be a little bit more type safe:

```js
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";

export interface GraphQLOptions {
  input?: object;
  variables?: object;
  authMode?: GRAPHQL_AUTH_MODE;
}

async function callGraphQL<T>(query: any, options?: GraphQLOptions): Promise<GraphQLResult<T>> {
  return (await API.graphql(graphqlOperation(query, options))) as GraphQLResult<T>
}

export default callGraphQL;
```

The function `callGraphQL<T>` is generic and just returns the result of `API.graphql(...)`. The Result is from the type `GraphQLResult<T>`. Without this small wrapper we would always have to cast it to `GraphQLResult<T>`.

### Query List ToDos

Create a new folder `src/models` and inside a file `todo.ts`. This is the file which contains the frontend model for our ToDo and a function to map the objects:

```js
import { ListTodosQuery } from "../API";
import { GraphQLResult } from "@aws-amplify/api";

interface Todo {
  id?: string;
  name?: string;
  description?: string;
}

function mapListTodosQuery(listTodosQuery: GraphQLResult<ListTodosQuery>): Todo[] {
  return listTodosQuery.data?.listTodos?.items?.map(todo => ({
    id: todo?.id,
    name: todo?.name,
    description: todo?.description
  } as Todo)) || []
}

export default Todo;
export { mapListTodosQuery as mapListTodos }
```

What is happening here? First, we import `ListTodosQuery` from '../API' and `GraphQLResult`. `API.ts` is generated by the Amplify CLI and contains the GraphQL API types. `GraphQLResult` is the generic interface which the GraphQL API returns.
Next, we have a simple `Todo` interface and a function `mapListTodosQuery`. This maps an object from type `GraphQLResult<ListTodosQuery>` to an array of our `ToDo`.

### Use our wrapper

Inside `App.tsx` we can finally call the GraphQL API with our wrapper:

```js
import React, { useState, useEffect } from "react";
import { listTodos } from "./graphql/queries";
import { ListTodosQuery } from "./API";
import Todo, { mapListTodos } from "./models/todo";

// omitted Amplify.configure

function App() {
  const [todos, setTodos] = useState<Todo[]>();

  useEffect(() => {
    async function getData() {
      try {
        const todoData = await callGraphQL<ListTodosQuery>(listTodos);
        const todos = mapListTodos(todoData);
        setTodos(todos);
      } catch (error) {
        console.error("Error fetching todos", error);
      }
    }
    getData();
  }, []);

  return (
    <div className="App">
      {todos?.map((t) => (
        <div key={t.id}>
          <h2>{t.name}</h2>
          <p>{t.description}</p>
        </div>
      ))}
    </div>
  );
}
```

We create a state which contains Todos with the `useState<Todo[]>` Hook.
Then `useEffect` is used to call the API initially. Since the API call is asynchronous, an `async function getData()` is defined. This function uses our previsouly created wrapper `callGraphQL()` and defines the generic type as `ListTodosQuery` which is imported from the auto-generated API.ts. As argument `listTodos` is passed. This is the actual GraphQL query which is also auto-generated by Amplify. The result is passed to the `mapListTodos` function which will return the ToDos as an Array. Afterwards, the state is updated.

### Create ToDo Mutation

To send a mutation the wrapper can be reused:

```js
const name = 'Learn Amplify'
const description = 'Start first Amplify project'

const response = await callGraphQL<CreateTodoMutation>(createTodo, {
        input: { name, description },
      } as CreateTodoMutationVariables);
```

These types need to be imported:
`CreateTodoMutation`: Type of what the mutation will return
`createTodo`: GraphQL Mutation
`CreateTodoMutationVariables`: type of the argument that gets passed in. This is an object with an `input` property which is an object that contains the properties for our new ToDo.

### Subscriptions

Subscriptions enable realtime updates. Whenever a new ToDo is created the subscription will emit the new ToDo. We can update the ToDo list with this new ToDo.

For that we create a generic interface `SubscriptionValue`:

```js
interface SubscriptionValue<T> {
  value: { data: T };
}
```

We also need a new mapping function for our ToDo model:

```js
function mapOnCreateTodoSubscription(createTodoSubscription: OnCreateTodoSubscription): Todo {
  const { id, name, description } = createTodoSubscription.onCreateTodo || {};
  return {
    id, name, description
  } as Todo
}
```

In `App.tsx` we add another `useEffect` which will handle the subscription:

```js
import Todo, { mapOnCreateTodoSubscription } from './models/todo';
import { SubscriptionValue } from './models/graphql-api';
import { onCreateTodo } from './graphql/subscriptions';

useEffect(() => {
  // @ts-ignore
  const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
    next: (response: SubscriptionValue<OnCreateTodoSubscription>) => {
      const todo = mapOnCreateTodoSubscription(response.value.data);
      console.log(todo);
      setTodos([...todos, todo]);
    },
  });

  return () => subscription.unsubscribe();
});
```

This is probably the most difficult part of using the GraphQL API with TypeScript.
The `Api.graphql(...)` function return type is from `Promise<GraphQLResult> | Observable<object>`

Only the `Observable` has the `subscribe` function. Without the `@ts-ignore` the TypeScript compiler would complain that `subscribe` does not exist on type `Promise<GraphQLResult> | Observable<object>`.
Unfortunately, we can't just simply cast it via `as Observable` because the Amplify SDK does not export an `Observable` type. There is already a [GitHub issues](https://github.com/aws-amplify/amplify-js/issues/5741) for that.

The subscribe function itself takes an object as an argument with a `next` property, which needs a function that gets called whenever a new ToDo is created (you can think of it as a callback).
The Parameter of that function is of type `SubscriptionValue<OnCreateTodoSubscription`. Pass `response.value.data` to the `mapOnCreateTodoSubscription` function which will return the ToDo. Afterwards, the state is updated with the new ToDo. Finally, in the return statement the subscription is unsubscribed when the component gets unmounted to avoid memory leak.

This may look a little verbose. This can be refactored to a wrapper function, as with the `callGraphQL` function:

```js
function subscribeGraphQL<T>(subscription: any, callback: (value: T) => void) {
  //@ts-ignore
  return API.graphql(graphqlOperation(subscription)).subscribe({
    next: (response: SubscriptionValue<T>) => {
      callback(response.value.data);
    },
  });
}
```

This is again a generic function which will return the subscription. It accepts the `subscription` and a callback. The `callback` is called in the next handler and `response.value.data` is passed as the argument.

The `useEffect` with the Subscription can be refactored to this:

```js
const onCreateTodoHandler = (
  createTodoSubscription: OnCreateTodoSubscription
) => {
  const todo = mapOnCreateTodoSubscription(createTodoSubscription);
  setTodos([...todos, todo]);
};

useEffect(() => {
  const subscription =
    subscribeGraphQL <
    OnCreateTodoSubscription >
    (onCreateTodo, onCreateTodoHandler);

  return () => subscription.unsubscribe();
}, [todos]);
```

The `onCreateTodoHandler` is responsible for calling the mapping function and updating the state with the new ToDo.
In `useEffect` we only call the new `subscribeGraphQL` wrapper function, passing the `onCreateTodo` subscription and our `onCreateTodoHandler`. As before, the subscription is unsubscribed when the components gets unmounted.

## Summary

Amplify allows to scaffold a GraphQL API very quickly and even auto-generates TypeScript code for the frontend. With some wrapper functions the boilerplate code can be reduced and type-safety embraced.

Feel free to leave a comment when you have any questions!
You can find me on [Twitter](https://twitter.com/RMuhlfeldner)

The full source code is on [GitHub](https://github.com/AppField/amplify-typescript-demo)
