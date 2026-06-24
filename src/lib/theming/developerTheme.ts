import type { ThemeTokens } from "@/types/domain";

export type { ThemeTokens as DeveloperThemeTokens } from "@/types/domain";

const CSS_VAR_PREFIX = "--developer";

export function applyDeveloperTheme(tokens: ThemeTokens, target?: HTMLElement): void {
  const el = target ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (!el) return;

  el.style.setProperty(`${CSS_VAR_PREFIX}-primary`, tokens.primaryColor);
  el.style.setProperty(`${CSS_VAR_PREFIX}-secondary`, tokens.secondaryColor);
  el.style.setProperty(`${CSS_VAR_PREFIX}-accent`, tokens.accentColor);
  if (tokens.typographyStyle) {
    el.style.setProperty(`${CSS_VAR_PREFIX}-typography`, tokens.typographyStyle);
  }
}

export function clearDeveloperTheme(target?: HTMLElement): void {
  const el = target ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (!el) return;

  el.style.removeProperty(`${CSS_VAR_PREFIX}-primary`);
  el.style.removeProperty(`${CSS_VAR_PREFIX}-secondary`);
  el.style.removeProperty(`${CSS_VAR_PREFIX}-accent`);
  el.style.removeProperty(`${CSS_VAR_PREFIX}-typography`);
}

export function developerThemeFromCms(
  cms: Partial<ThemeTokens> | null | undefined,
): ThemeTokens | null {
  if (!cms?.primaryColor || !cms?.secondaryColor || !cms?.accentColor) return null;
  return {
    primaryColor: cms.primaryColor,
    secondaryColor: cms.secondaryColor,
    accentColor: cms.accentColor,
    typographyStyle: cms.typographyStyle,
  };
}
