### How to host it at your Github pages

1. Read the [GitHub pages documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
2. Add a CNAME record `<user>.github.io` with your subdomain to your domain DNS
3. Fork the repo
4. Change the line 4 in the `deploy.sh` file according to your repository address

```
git remote add origin git@github.com:YourGitHubAccount/touchme.git
```

4. Change the contents of `public/CNAME` file to match the subdomain you want the app to be accessible at
5. Run `pnpm run build` to build the app to `dist/` folder
6. Run `pnpm run deploy` to upload the built site to the `gh-pages` branch of your repo
7. Go to your repository settings and configure the GitHub pages.
8. Enjoy your self-hosted version of the interactive playground.
