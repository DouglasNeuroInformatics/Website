import { motion } from 'framer-motion';

export const Logo: React.FC<{
  animate?: boolean;
  className?: string;
}> = ({ animate, className }) => {
  return (
    <svg
      className={className}
      height="666.378"
      preserveAspectRatio="xMidYMid"
      version="1.0"
      viewBox="0 0 620.397 499.784"
      width="827.196"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bottom Brain Background */}
      <path
        className="fill-logo-900 dark:fill-logo-800"
        d="M524.302 405.313c.055 5.039-1.25 11.629-2.61 17.059-9.495 38.199-51.66 81.066-111.007 77.164-53.79-3.524-97.598-29.243-97.598-65.305s43.703-65.3 97.598-65.3 113.277.32 113.617 36.382m0 0"
      />
      {/* Middle Brain Background */}
      <path
        className="fill-logo-300"
        d="M410.685 374.985c-28.953 0-95.024 7.976-110.188 7.976-26.785 0-48.511 16.743-48.511 37.399 0 9.937 5.113 18.914 13.304 25.61 0 0 17.989 17.968 50.39 9.347 14.18-3.774 37.247-31.805 77.856-36.258 20.223-2.227 58.114 13.355 124.704 13.73 2.863-6.125 3.453-10.382 3.453-10.382 0-36.098-57.114-47.422-111.008-47.422m0 0"
      />
      {/* Top Brain Background */}
      <path
        className="fill-logo-900 dark:fill-logo-800"
        d="M521.693 422.372s39.054-7.891 63.336-39.696c28.308-37.094 24.586-76.789 24.586-76.789 28.683-53.43-8.938-103.523-8.938-103.523-3.738-56.403-38.75-79.766-38.75-79.766-22.73-53.8-73.012-68.262-73.012-68.262-39.48-46-109.523-44.52-109.523-44.52s-65.625-23.952-155.715 2.973c-14.894 4.454-64.82 14.836-101.332 37.098C7.259 120.051-1.452 229.47.158 247.258c8.925 99.426 78.964 117.235 123.671 127.617 10.422 28.192 48.797 80.141 117.711 60.852 84.938-14.832 120.703-40.066 141.57-40.066 20.868 0 78.985 22.257 138.583 26.71m0 0"
      />
      {/* Inner Brain Background */}
      <g transform="translate(-401.632 -14.386)">
        <motion.path
          className="fill-white"
          d={[
            'M 794.86 161.21c0-5.98-4.848-10.823-10.833-10.823-5.976 0-10.824 4.843-10.824 10.824s4.848 10.82 10.824 10.82c5.985 0 10.832-4.84 10.832-10.82m11.124 91.661c-5.984 0-10.832 4.84-10.832 10.82 0 5.977 4.848 10.825 10.832 10.825 5.977 0 10.825-4.848 10.825-10.825 0-5.98-4.848-10.82-10.825-10.82M629.633 280.75c-4.23 4.227-4.23 11.082 0 15.309s11.086 4.226 15.312 0c4.23-4.227 4.23-11.082 0-15.309-4.226-4.227-11.082-4.227-15.312 0m51.722-103.762c-5.98 0-10.828 4.844-10.828 10.825 0 5.976 4.848 10.824 10.828 10.824s10.829-4.848 10.829-10.825c0-5.98-4.848-10.824-10.829-10.824m243.512 23.825c-13.824-15.633-31.82-26.774-51.691-32.188-1.356-41.793-35.79-75.375-77.922-75.375-4.895 0-9.73.45-14.48 1.344a106.5 106.5 0 0 0-32.278-32.867c-17.25-11.23-37.293-17.168-57.96-17.168-58.641 0-106.352 47.687-106.352 106.304 0 6.516.59 12.969 1.757 19.305a106.64 106.64 0 0 0-47.437 31.656c-16.613 19.262-25.762 43.903-25.762 69.367q0 1.101.024 2.196c.886 43.539 28.582 80.265 66.992 95.355V253.965c-5.68-3-9.547-8.965-9.547-15.836 0-10.129 8.406-18.29 18.621-17.902 9.234.355 16.781 7.832 17.203 17.066.328 7.219-3.621 13.55-9.527 16.672V373.77a106.5 106.5 0 0 0 22.199 2.332h67.094v-36.805l-43.23-33.774c-6.141 1.887-13.094.403-17.958-4.453-7.16-7.16-6.992-18.875.508-25.82 6.777-6.281 17.41-6.324 24.234-.094 5.34 4.871 7.028 12.14 5.059 18.528l48.137 38.68v43.738h21.62V304.57l-51.19-40.183v-60.735c-5.907-3.129-9.86-9.457-9.528-16.675.422-9.235 7.969-16.715 17.203-17.067 10.219-.387 18.625 7.774 18.625 17.903 0 6.87-3.87 12.832-9.55 15.84v52.593l34.44 27.035v-133.93c-5.679-3.011-9.55-8.972-9.55-15.843 0-10.125 8.406-18.285 18.625-17.899 9.234.348 16.785 7.832 17.203 17.063.328 7.219-3.62 13.547-9.531 16.68v87.625l34.738-27.266v-32.66c-5.68-3.004-9.55-8.973-9.55-15.84 0-10.129 8.406-18.293 18.62-17.906 9.239.355 16.786 7.836 17.208 17.07.328 7.219-3.625 13.547-9.528 16.676v40.797l-51.488 40.414v117.84h102.344l-45.657-35.836V279.53c-5.902-3.125-9.855-9.457-9.53-16.676.425-9.23 7.972-16.71 17.21-17.066 10.215-.387 18.621 7.777 18.621 17.902 0 6.872-3.87 12.836-9.55 15.84v52.594l34.437 27.035V225.23c-5.676-3.007-9.547-8.972-9.547-15.843 0-10.121 8.41-18.29 18.625-17.899 9.234.352 16.785 7.832 17.203 17.063.328 7.219-3.62 13.547-9.531 16.68v149.335c20.262-3.496 39.207-12.89 54.055-27.445q.76-.743 1.515-1.516c19.606-19.984 30.399-46.417 30.399-74.414 0-25.953-9.461-50.949-26.645-70.378m-336.734 26.496c-5.98 0-10.828 4.84-10.828 10.82 0 5.976 4.847 10.82 10.828 10.82s10.828-4.844 10.828-10.82c0-5.98-4.848-10.82-10.828-10.82m144.414-104.625c-5.984 0-10.828 4.847-10.828 10.824 0 5.98 4.844 10.828 10.828 10.828 5.976 0 10.824-4.848 10.824-10.828 0-5.977-4.848-10.824-10.824-10.824m124.621 75.882c-5.977 0-10.828 4.848-10.828 10.82 0 5.981 4.851 10.829 10.828 10.829 5.98 0 10.828-4.848 10.828-10.828 0-5.973-4.848-10.82-10.828-10.82'
          ].join(' ')}
          {...(animate && {
            animate: {
              fillOpacity: '100%'
            },
            initial: {
              fillOpacity: '0%'
            },
            transition: {
              duration: 2,
              repeat: Infinity
            }
          })}
        />
      </g>
    </svg>
  );
};
