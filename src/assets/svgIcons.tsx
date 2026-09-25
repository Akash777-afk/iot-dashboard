// Inline React versions of the project's icon set. Rendered as JSX (not
// <img src>) so the production build can inline everything into a single
// portable HTML file without depending on Vite's asset-inlining pipeline.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function IconLayers(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.6917 1.81668C10.4745 1.71764 10.2387 1.66638 10 1.66638C9.76135 1.66638 9.52548 1.71764 9.30834 1.81668L2.16668 5.06668C2.0188 5.13188 1.89308 5.23868 1.80481 5.37406C1.71655 5.50944 1.66956 5.66757 1.66956 5.82918C1.66956 5.99079 1.71655 6.14892 1.80481 6.2843C1.89308 6.41968 2.0188 6.52648 2.16668 6.59168L9.31668 9.85001C9.53381 9.94905 9.76969 10.0003 10.0083 10.0003C10.247 10.0003 10.4829 9.94905 10.7 9.85001L17.85 6.60001C17.9979 6.53481 18.1236 6.42801 18.2119 6.29263C18.3001 6.15725 18.3471 5.99913 18.3471 5.83751C18.3471 5.6759 18.3001 5.51777 18.2119 5.38239C18.1236 5.24701 17.9979 5.14022 17.85 5.07501L10.6917 1.81668Z" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.66666 10C1.66626 10.1594 1.71159 10.3155 1.79726 10.45C1.88292 10.5844 2.00534 10.6914 2.14999 10.7583L9.31666 14.0167C9.53266 14.1145 9.76704 14.1651 10.0042 14.1651C10.2413 14.1651 10.4757 14.1145 10.6917 14.0167L17.8417 10.7667C17.9892 10.7004 18.1142 10.5926 18.2015 10.4564C18.2888 10.3203 18.3346 10.1617 18.3333 10" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.66666 14.1667C1.66626 14.3261 1.71159 14.4822 1.79726 14.6166C1.88292 14.7511 2.00534 14.8581 2.14999 14.925L9.31666 18.1834C9.53266 18.2812 9.76704 18.3318 10.0042 18.3318C10.2413 18.3318 10.4757 18.2812 10.6917 18.1834L17.8417 14.9334C17.9892 14.8671 18.1142 14.7593 18.2015 14.6231C18.2888 14.487 18.3346 14.3284 18.3333 14.1667" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.9864 4.48639V10.4864M11.4864 6.28639L8.9864 4.48639L6.4864 6.28639" stroke="#2563EB" strokeWidth="1.49773" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.99698 12.9803L3.49471 15.9758H14.4781L15.9758 12.9803" stroke="#2563EB" strokeWidth="1.49773" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconDeviceMonitor(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_8_1666)">
        <path d="M10 1.5H2C1.44772 1.5 1 1.94772 1 2.5V7.5C1 8.05228 1.44772 8.5 2 8.5H10C10.5523 8.5 11 8.05228 11 7.5V2.5C11 1.94772 10.5523 1.5 10 1.5Z" stroke="#45556C" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 10.5H8M6 8.5V10.5" stroke="#45556C" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_8_1666">
          <rect width="12" height="12" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 6H9.5M6 9.5L9.5 6L6 2.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconBlocked(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.98641 16.4751C13.1223 16.4751 16.4751 13.1223 16.4751 8.98641C16.4751 4.85053 13.1223 1.49774 8.98641 1.49774C4.85053 1.49774 1.49774 4.85053 1.49774 8.98641C1.49774 13.1223 4.85053 16.4751 8.98641 16.4751Z" stroke="#DC2626" strokeWidth="1.49773"/>
      <path d="M2.99548 2.99548L14.9774 14.9774" stroke="#DC2626" strokeWidth="1.49773" strokeLinecap="round"/>
    </svg>
  );
}

export function IconChevronDownGray(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.99628 4.99377L6.99131 8.9888L10.9863 4.99377" stroke="#98A2B3" strokeWidth="1.49814" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconShieldCheck(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_3_71)">
        <path d="M8.98637 0.998474L15.9758 3.99394V8.98639C15.9758 12.9803 12.9803 15.9758 8.98637 16.9743C4.99241 15.9758 1.99695 12.9803 1.99695 8.98639V3.99394L8.98637 0.998474Z" stroke="white" strokeWidth="1.49773" strokeLinejoin="round"/>
        <path d="M5.99091 8.98642L7.98788 10.9834L11.9818 6.98944" stroke="white" strokeWidth="1.49773" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_3_71">
          <rect width="17.9728" height="17.9728" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconAlertCircle(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_4_1401)">
        <path d="M8.98641 16.4751C13.1223 16.4751 16.4751 13.1223 16.4751 8.98641C16.4751 4.85053 13.1223 1.49774 8.98641 1.49774C4.85053 1.49774 1.49774 4.85053 1.49774 8.98641C1.49774 13.1223 4.85053 16.4751 8.98641 16.4751Z" stroke="#D97706" strokeWidth="1.49773"/>
        <path d="M8.98639 5.99091V9.98486M8.98639 12.4811V12.9803" stroke="#D97706" strokeWidth="1.49773" strokeLinecap="round"/>
      </g>
      <defs>
        <clipPath id="clip0_4_1401">
          <rect width="17.9728" height="17.9728" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconCheckCircle(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.98639 16.4751C13.1223 16.4751 16.4751 13.1223 16.4751 8.98641C16.4751 4.85053 13.1223 1.49774 8.98639 1.49774C4.85052 1.49774 1.49773 4.85053 1.49773 8.98641C1.49773 13.1223 4.85052 16.4751 8.98639 16.4751Z" stroke="#32B57A" strokeWidth="1.49773"/>
      <path d="M5.49168 8.9864L7.98791 11.4826L12.9804 6.49017" stroke="#32B57A" strokeWidth="1.49773" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconChevronDownDark(props: IconProps) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.74597 4.11896L5.49195 6.86493L8.23792 4.11896" stroke="#45556C" strokeWidth="1.14416" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconDeviceFrame(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_3_35)">
        <path d="M15.4766 2.99548H2.49621C1.66903 2.99548 0.998474 3.66604 0.998474 4.49322V12.4811C0.998474 13.3083 1.66903 13.9789 2.49621 13.9789H15.4766C16.3037 13.9789 16.9743 13.3083 16.9743 12.4811V4.49322C16.9743 3.66604 16.3037 2.99548 15.4766 2.99548Z" stroke="white" strokeWidth="1.49773"/>
        <path d="M5.99091 16.9743H11.9818" stroke="white" strokeWidth="1.49773" strokeLinecap="round"/>
        <path d="M8.98639 13.9788V16.9743" stroke="white" strokeWidth="1.49773" strokeLinecap="round"/>
        <path d="M8.98642 10.4841C10.0893 10.4841 10.9834 9.59005 10.9834 8.48715C10.9834 7.38425 10.0893 6.49017 8.98642 6.49017C7.88352 6.49017 6.98944 7.38425 6.98944 8.48715C6.98944 9.59005 7.88352 10.4841 8.98642 10.4841Z" stroke="white" strokeWidth="1.49773"/>
      </g>
      <defs>
        <clipPath id="clip0_3_35">
          <rect width="17.9728" height="17.9728" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_3_25)">
        <path d="M6.49016 0.998474H2.49621C1.66903 0.998474 0.998474 1.66903 0.998474 2.49621V6.49016C0.998474 7.31734 1.66903 7.9879 2.49621 7.9879H6.49016C7.31734 7.9879 7.9879 7.31734 7.9879 6.49016V2.49621C7.9879 1.66903 7.31734 0.998474 6.49016 0.998474Z" stroke="white" strokeWidth="1.49773"/>
        <path d="M15.4766 0.998474H11.4826C10.6554 0.998474 9.98486 1.66903 9.98486 2.49621V6.49016C9.98486 7.31734 10.6554 7.9879 11.4826 7.9879H15.4766C16.3037 7.9879 16.9743 7.31734 16.9743 6.49016V2.49621C16.9743 1.66903 16.3037 0.998474 15.4766 0.998474Z" stroke="white" strokeWidth="1.49773"/>
        <path d="M6.49016 9.98486H2.49621C1.66903 9.98486 0.998474 10.6554 0.998474 11.4826V15.4766C0.998474 16.3037 1.66903 16.9743 2.49621 16.9743H6.49016C7.31734 16.9743 7.9879 16.3037 7.9879 15.4766V11.4826C7.9879 10.6554 7.31734 9.98486 6.49016 9.98486Z" stroke="white" strokeWidth="1.49773"/>
        <path d="M15.4766 9.98486H11.4826C10.6554 9.98486 9.98486 10.6554 9.98486 11.4826V15.4766C9.98486 16.3037 10.6554 16.9743 11.4826 16.9743H15.4766C16.3037 16.9743 16.9743 16.3037 16.9743 15.4766V11.4826C16.9743 10.6554 16.3037 9.98486 15.4766 9.98486Z" stroke="white" strokeWidth="1.49773"/>
      </g>
      <defs>
        <clipPath id="clip0_3_25">
          <rect width="17.9728" height="17.9728" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconDocument(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_3_62)">
        <path d="M12.9804 0.998474H4.99246C3.88956 0.998474 2.99548 1.89255 2.99548 2.99545V14.9773C2.99548 16.0802 3.88956 16.9743 4.99246 16.9743H12.9804C14.0833 16.9743 14.9774 16.0802 14.9774 14.9773V2.99545C14.9774 1.89255 14.0833 0.998474 12.9804 0.998474Z" stroke="white" strokeWidth="1.49773"/>
        <path d="M5.99091 4.99243H7.98788M5.99091 7.9879H11.9818M5.99091 10.9834H11.9818M5.99091 13.9788H9.98486" stroke="white" strokeWidth="1.49773" strokeLinecap="round"/>
        <path d="M9.98486 0.998474V4.49319C9.98486 4.62559 10.0375 4.75258 10.1311 4.8462C10.2247 4.93983 10.3517 4.99243 10.4841 4.99243H12.9803" stroke="white" strokeWidth="1.49773"/>
      </g>
      <defs>
        <clipPath id="clip0_3_62">
          <rect width="17.9728" height="17.9728" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconUploadTray(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_3_45)">
        <path d="M8.98637 0.998474V10.9834M11.9818 3.99394L8.98637 0.998474L5.99091 3.99394" stroke="white" strokeWidth="1.49773" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.99544 12.9803H14.9773C15.2421 12.9803 15.4961 13.0855 15.6833 13.2728C15.8706 13.4601 15.9758 13.714 15.9758 13.9788V15.9758C15.9758 16.2406 15.8706 16.4946 15.6833 16.6819C15.4961 16.8691 15.2421 16.9743 14.9773 16.9743H2.99544C2.73062 16.9743 2.47665 16.8691 2.2894 16.6819C2.10215 16.4946 1.99695 16.2406 1.99695 15.9758V13.9788C1.99695 13.714 2.10215 13.4601 2.2894 13.2728C2.47665 13.0855 2.73062 12.9803 2.99544 12.9803Z" stroke="white" strokeWidth="1.49773"/>
      </g>
      <defs>
        <clipPath id="clip0_3_45">
          <rect width="17.9728" height="17.9728" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconTrend(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_3_53)">
        <path d="M0.998474 12.9804L4.99243 7.98791L7.9879 10.9834L11.9819 3.99396L16.9743 8.9864" stroke="currentColor" strokeWidth="1.49773" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.998489 13.9789C1.54994 13.9789 1.99698 13.5318 1.99698 12.9804C1.99698 12.4289 1.54994 11.9819 0.998489 11.9819C0.447039 11.9819 0 12.4289 0 12.9804C0 13.5318 0.447039 13.9789 0.998489 13.9789Z" fill="currentColor"/>
        <path d="M16.9743 9.98489C17.5258 9.98489 17.9728 9.53785 17.9728 8.9864C17.9728 8.43495 17.5258 7.98792 16.9743 7.98792C16.4229 7.98792 15.9758 8.43495 15.9758 8.9864C15.9758 9.53785 16.4229 9.98489 16.9743 9.98489Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_3_53">
          <rect width="17.9728" height="17.9728" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14.6114 2.48639H3.3614C2.32587 2.48639 1.4864 3.54463 1.4864 4.85003V13.1228C1.4864 14.4282 2.32587 15.4864 3.3614 15.4864H14.6114C15.6469 15.4864 16.4864 14.4282 16.4864 13.1228V4.85003C16.4864 3.54463 15.6469 2.48639 14.6114 2.48639Z" stroke="#B906D9" strokeWidth="1.49773"/>
      <path d="M4.99245 6.98944H12.9804M4.99245 9.98491H9.98489" stroke="#B906D9" strokeWidth="1.49773" strokeLinecap="round"/>
    </svg>
  );
}

export function IconChartBars(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.25 15.75V10.5M9 15.75V6.75M15.75 15.75V2.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.25 15.75H15.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconMapping(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1.49774" y="1.49774" width="5.99095" height="5.99095" rx="1.49774" stroke="white" strokeWidth="1.49773"/>
      <rect x="10.5117" y="10.5117" width="5.99095" height="5.99095" rx="1.49774" stroke="white" strokeWidth="1.49773"/>
      <path d="M7.4887 7.4887L10.5117 10.5117" stroke="white" strokeWidth="1.49773" strokeLinecap="round"/>
    </svg>
  );
}

export function IconEdit(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.25 2.75L15.25 6.75L6.25 15.75H2.25V11.75L11.25 2.75Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.75 4.25L13.75 8.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1.5 9C1.5 9 4.5 3.75 9 3.75C13.5 3.75 16.5 9 16.5 9C16.5 9 13.5 14.25 9 14.25C4.5 14.25 1.5 9 1.5 9Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 16.5C9 16.5 15 11.5 15 7C15 3.68629 12.3137 1 9 1C5.68629 1 3 3.68629 3 7C3 11.5 9 16.5 9 16.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="4.5" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.5 4.5V2.25C7.5 1.83 7.83 1.5 8.25 1.5H9.75C10.17 1.5 10.5 1.83 10.5 2.25V4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.75 8.25H7.5M10.5 8.25H11.25M6.75 11.25H7.5M10.5 11.25H11.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9 1.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 7.5L9 11L12.5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 13.5V15C3 15.5523 3.44772 16 4 16H14C14.5523 16 15 15.5523 15 15V13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15 9C15 12.3137 12.3137 15 9 15C6.53213 15 4.41213 13.5228 3.48409 11.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 9C3 5.68629 5.68629 3 9 3C11.4679 3 13.5879 4.47715 14.5159 6.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 12V9H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6V9H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 8.25V12.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9" cy="5.7" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function IconChevronBreadcrumb(props: IconProps) {
  return (
    <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0.749084 0.749084L4.74411 5.3865L0.749084 10.0239" stroke="#C4CDDA" strokeWidth="1.49814" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
