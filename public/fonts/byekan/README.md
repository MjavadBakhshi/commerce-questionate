# B Yekan font files (Persian)

Place licensed **B Yekan / BYekan** webfont files in this folder before Phase 5:

```text
public/fonts/byekan/
  BYekan.woff2
  BYekan-Bold.woff2   # optional
```

The Persian locale (`/fa`) is configured to use the `byekan` font token in `lib/survey/config.ts`.

## License

Confirm you have rights to self-host these files on your production domain.

## Open-source alternative

If BYekan is unavailable, [Vazirmatn](https://github.com/rastikerdar/vazirmatn) is a common free Persian webfont. Swap the files and update `lib/fonts.ts` in Phase 5.
