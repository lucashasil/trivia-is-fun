<a name="readme-top"></a>

<h3 align="center">trivia-is-fun</h3>
  <p align="center">
    A React based Trivia game that utilizes the Open Trivia DB API
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#linting">Linting</a></li>
        <li><a href="#tests">Tests</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

This project is a Trivia game implemented using React and the [Open Trivia DB](https://opentdb.com/) API for questions.

Players are given the ability to create Trivia games with a number of customizable parameters like:
* the number of questions
* the difficulty of questions
* specifying specific question categories

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Node][Node.js]][Node-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![React][React.js]][React-url]
* [![Sass][Sass]][Sass-url]
* [![Jest][Jest]][Jest-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Getting the project running locally is very simple and can be accomplished by following these simple steps.

### Prerequisites

* Node.js `>= 18.x`
  * This project requires a minimum Node.js version of `18`
* npm
  ```sh
  npm install -g npm@latest
  ```

### Installation

1. Clone the repo to your local drive
   ```sh
   git clone https://github.com/lucashasil/trivia-is-fun.git
   ```
2. Install required npm packages
   ```sh
   npm install
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Running this project is very simple and just requires you to run:
```sh
npm run start
```

### Linting

`ESLint` is used for code linting in this project and can be run by using the following in the project root:
```sh
npx eslint .
```

Alternatively, any issues can attempt to be autofixed by running:
```sh
npx eslint . --fix
```

### Tests

This project includes a few unit and integration tests with the help of `Jest`. These tests can be run using the following:
```sh
npm run test
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See [LICENSE](https://github.com/lucashasil/trivia-is-fun/blob/main/LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Sass]: https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white
[Sass-url]: https://sass-lang.com/
[Jest]: https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white
[Jest-url]: https://jestjs.io/
