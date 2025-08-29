## Troubleshoot:

If you have problems with husky not running before every commit and/or not running before pushing, follow these steps:

- Run the command:

```bash
npx husky-init && npm
```

- Then undo the changes on the pre-commit file in /.husky folder
- After that husky should run before every commit and push to origin

Then if you have problems with husky's hooks being ignored, you can try running this command:

```bash
chmod ug+x .husky/*
```

### Running the project locally

```bash
npm run dev
```

### Execute the tests

```bash
npm run test
```

##### Execute the tests (with coverage)

```bash
npm run test:coverage
```

### Execute the linter

```bash
npm run lint
```

### Run Storybook

```bash
npm run storybook
```

## Recommended tools:

- [TS Diagram](https://tsdiagram.com/)

- [Remix Icons](https://remixicon.com/)
