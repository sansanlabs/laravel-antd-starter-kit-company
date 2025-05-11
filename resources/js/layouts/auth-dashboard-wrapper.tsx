import { prefersDark, useAppearance } from "@/hooks/use-appearance";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { App, ConfigProvider } from "antd";
import { ThemeProvider, useTheme } from "antd-style";
import enUS from "antd/locale/en_US";
import idID from "antd/locale/id_ID";
import jaJP from "antd/locale/ja_JP";
import { PropsWithChildren } from "react";

export default function AuthDashboardWrapper({ children }: PropsWithChildren) {
  const { appearance, updateAppearance } = useAppearance();

  const isDark = appearance === "dark" || (appearance === "auto" && prefersDark());
  const themeMode = appearance === "auto" ? "auto" : appearance;
  const appearanceApp = isDark ? "dark" : "light";

  return (
    <ThemeProvider
      onThemeModeChange={(mode) => {
        updateAppearance(mode);
      }}
      theme={{
        cssVar: true,
        token: {
          colorBgBase: isDark ? "#141414" : "#FFF",
        },
      }}
      appearance={appearanceApp}
      themeMode={themeMode}
    >
      <Theme>
        <App>{children}</App>
      </Theme>
    </ThemeProvider>
  );
}

function Theme({ children }: PropsWithChildren) {
  const { locale } = usePage<SharedData>().props;
  const { colorText, colorBorder, colorBgBase, colorFillAlter, colorFillSecondary, colorFillQuaternary } = useTheme();

  return (
    <ConfigProvider
      locale={locale === "id" ? idID : locale === "ja" ? jaJP : enUS}
      theme={{
        cssVar: true,
        token: {
          fontFamily: "Geist",
          screenXS: 480,
          screenSM: 576,
          screenMD: 768,
          screenLG: 992,
          screenXL: 1200,
          screenXXL: 1600,
          colorPrimary: "#124C9A",
          colorLink: "#124C9A",
          colorBgLayout: colorBgBase,
          colorSplit: colorBorder,
          colorBgContainer: colorBgBase,
          borderRadius: 0,
        },
        components: {
          Layout: {
            bodyBg: colorBgBase,
            siderBg: colorFillAlter,
            headerBg: colorBgBase,
            headerPadding: "8px 16px",
            footerPadding: "8px 16px",
          },
          Button: {
            defaultShadow: "none",
            dangerShadow: "none",
          },
          Form: {
            verticalLabelPadding: 0,
          },
          Table: {
            headerBorderRadius: 0,
          },
          Menu: {
            itemPaddingInline: 0,
            itemMarginInline: 0,
            itemBorderRadius: 0,
            darkItemBg: "transparent",
            darkItemColor: colorText,
            darkItemHoverColor: colorText,
            darkItemHoverBg: colorFillSecondary,
            darkSubMenuItemBg: colorFillQuaternary,
            itemMarginBlock: 0,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
