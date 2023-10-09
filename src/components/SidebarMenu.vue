<script setup lang="ts">
import {Pages} from "@/components/SidebarMenu";
import { useAuth0 } from '@auth0/auth0-vue';
import WorkspacesDropdown from "@/components/WorkspacesDropdown.vue";

const props = defineProps({
  selectedPage: {
    type: String,
    required: true
  }
});

const { logout } = useAuth0();
function exit() {
  logout({ logoutParams: { returnTo: window.location.origin } });
}
</script>

<template>
  <div class="sidebar-menu">
    <WorkspacesDropdown/>
    <hr class="sidebar-menu_divider"/>
    <ul class="sidebar-menu_buttons" style="flex-grow: 1">
      <router-link to="/">
        <li :class="props.selectedPage === Pages.boards ? 'sidebar-menu_buttons_button__selected' : 'sidebar-menu_buttons_button'">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_596_177)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.66669 1.83325H8.33335V12.6666H1.66669V1.83325ZM3.33335 3.49992V10.9999H6.66669V3.49992H3.33335Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.66669 1.83325H13.3334V18.4999H6.66669V1.83325ZM8.33335 3.49992V16.8333H11.6667V3.49992H8.33335Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6667 1.83325H18.3334V15.1666H11.6667V1.83325ZM13.3334 3.49992V13.4999H16.6667V3.49992H13.3334Z" fill="currentColor"/>
            </g>
            <defs>
              <clipPath id="clip0_596_177">
                <rect width="20" height="20" fill="white"/>
              </clipPath>
            </defs>
          </svg>
            <span style="margin-left: 8px; font-family: Manrope;">Boards</span>
        </li>
      </router-link>
      <router-link to="/my-tasks">
        <li :class="props.selectedPage === Pages.my_tasks ? 'sidebar-menu_buttons_button__selected' : 'sidebar-menu_buttons_button'">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_596_172)">
              <path d="M14.1667 1.66667H16.6667C16.8877 1.66667 17.0996 1.75446 17.2559 1.91074C17.4122 2.06702 17.5 2.27899 17.5 2.5V17.5C17.5 17.721 17.4122 17.933 17.2559 18.0893C17.0996 18.2455 16.8877 18.3333 16.6667 18.3333H3.33333C3.11232 18.3333 2.90036 18.2455 2.74408 18.0893C2.5878 17.933 2.5 17.721 2.5 17.5V2.5C2.5 2.27899 2.5878 2.06702 2.74408 1.91074C2.90036 1.75446 3.11232 1.66667 3.33333 1.66667H5.83333V0H7.5V1.66667H12.5V0H14.1667V1.66667ZM14.1667 3.33333V5H12.5V3.33333H7.5V5H5.83333V3.33333H4.16667V16.6667H15.8333V3.33333H14.1667ZM5.83333 6.66667H14.1667V8.33333H5.83333V6.66667ZM5.83333 10H14.1667V11.6667H5.83333V10Z" fill="currentColor"/>
            </g>
            <defs>
              <clipPath id="clip0_596_172">
                <rect width="20" height="20" fill="white"/>
              </clipPath>
            </defs>
          </svg>
            <span style="margin-left: 8px; font-family: Manrope;">My tasks</span>
        </li>
      </router-link>
      <router-link to="/docs-and-files">
        <li :class="props.selectedPage === Pages.docs_and_files ? 'sidebar-menu_buttons_button__selected' : 'sidebar-menu_buttons_button'">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_596_168)">
              <path d="M11.6666 11.2501V6.66675C11.6666 5.78269 11.3155 4.93485 10.6903 4.30973C10.0652 3.6846 9.21737 3.33341 8.33331 3.33341C7.44926 3.33341 6.60141 3.6846 5.97629 4.30973C5.35117 4.93485 4.99998 5.78269 4.99998 6.66675V11.2501C4.99998 12.6867 5.57066 14.0644 6.58648 15.0802C7.60231 16.0961 8.98006 16.6667 10.4166 16.6667C11.8532 16.6667 13.231 16.0961 14.2468 15.0802C15.2626 14.0644 15.8333 12.6867 15.8333 11.2501V3.33341H17.5V11.2501C17.5 13.1287 16.7537 14.9304 15.4253 16.2588C14.0969 17.5871 12.2953 18.3334 10.4166 18.3334C8.53803 18.3334 6.73636 17.5871 5.40797 16.2588C4.07959 14.9304 3.33331 13.1287 3.33331 11.2501V6.66675C3.33331 5.34067 3.8601 4.0689 4.79778 3.13121C5.73546 2.19353 7.00723 1.66675 8.33331 1.66675C9.6594 1.66675 10.9312 2.19353 11.8688 3.13121C12.8065 4.0689 13.3333 5.34067 13.3333 6.66675V11.2501C13.3333 12.0236 13.026 12.7655 12.479 13.3125C11.9321 13.8595 11.1902 14.1667 10.4166 14.1667C9.6431 14.1667 8.90123 13.8595 8.35425 13.3125C7.80727 12.7655 7.49998 12.0236 7.49998 11.2501V6.66675H9.16665V11.2501C9.16665 11.5816 9.29834 11.8995 9.53276 12.134C9.76718 12.3684 10.0851 12.5001 10.4166 12.5001C10.7482 12.5001 11.0661 12.3684 11.3005 12.134C11.535 11.8995 11.6666 11.5816 11.6666 11.2501Z" fill="currentColor"/>
            </g>
            <defs>
              <clipPath id="clip0_596_168">
                <rect width="20" height="20" fill="white"/>
              </clipPath>
            </defs>
          </svg>
            <span style="margin-left: 8px; font-family: Manrope;">Docs & Files</span>
        </li>
      </router-link>
      <router-link to="/team">
        <li :class="props.selectedPage === Pages.team ? 'sidebar-menu_buttons_button__selected' : 'sidebar-menu_buttons_button'">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Group">
              <path id="Vector" d="M15 16.5H13.5V15C13.5 14.4033 13.2629 13.831 12.841 13.409C12.419 12.9871 11.8467 12.75 11.25 12.75H6.75C6.15326 12.75 5.58097 12.9871 5.15901 13.409C4.73705 13.831 4.5 14.4033 4.5 15V16.5H3V15C3 14.0054 3.39509 13.0516 4.09835 12.3483C4.80161 11.6451 5.75544 11.25 6.75 11.25H11.25C12.2446 11.25 13.1984 11.6451 13.9017 12.3483C14.6049 13.0516 15 14.0054 15 15V16.5ZM9 9.75C8.40905 9.75 7.82389 9.6336 7.27792 9.40746C6.73196 9.18131 6.23588 8.84984 5.81802 8.43198C5.40016 8.01412 5.06869 7.51804 4.84254 6.97208C4.6164 6.42611 4.5 5.84095 4.5 5.25C4.5 4.65905 4.6164 4.07389 4.84254 3.52792C5.06869 2.98196 5.40016 2.48588 5.81802 2.06802C6.23588 1.65016 6.73196 1.31869 7.27792 1.09254C7.82389 0.866396 8.40905 0.75 9 0.75C10.1935 0.75 11.3381 1.22411 12.182 2.06802C13.0259 2.91193 13.5 4.05653 13.5 5.25C13.5 6.44347 13.0259 7.58807 12.182 8.43198C11.3381 9.27589 10.1935 9.75 9 9.75ZM9 8.25C9.79565 8.25 10.5587 7.93393 11.1213 7.37132C11.6839 6.80871 12 6.04565 12 5.25C12 4.45435 11.6839 3.69129 11.1213 3.12868C10.5587 2.56607 9.79565 2.25 9 2.25C8.20435 2.25 7.44129 2.56607 6.87868 3.12868C6.31607 3.69129 6 4.45435 6 5.25C6 6.04565 6.31607 6.80871 6.87868 7.37132C7.44129 7.93393 8.20435 8.25 9 8.25Z" fill="currentColor"/>
            </g>
          </svg>
            <span style="margin-left: 8px; font-family: Manrope;">Team</span>
        </li>
      </router-link>
    </ul>
    <hr class="sidebar-menu_divider"/>
    <ul class="sidebar-menu_buttons">
      <router-link to="/release-notes">
        <li :class="props.selectedPage === Pages.release_notes ? 'sidebar-menu_buttons_button__selected' : 'sidebar-menu_buttons_button'">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M2 3.993C2.00183 3.73038 2.1069 3.47902 2.29251 3.29322C2.47813 3.10742 2.72938 3.00209 2.992 3H21.008C21.556 3 22 3.445 22 3.993V20.007C21.9982 20.2696 21.8931 20.521 21.7075 20.7068C21.5219 20.8926 21.2706 20.9979 21.008 21H2.992C2.72881 20.9997 2.4765 20.895 2.29049 20.7088C2.10448 20.5226 2 20.2702 2 20.007V3.993ZM11 5H4V19H11V5ZM13 5V19H20V5H13ZM14 7H19V9H14V7ZM14 10H19V12H14V10Z" fill="currentColor"/>
          </svg>
          <span style="margin-left: 8px; font-family: Manrope;">Release Notes</span>
        </li>
      </router-link>
      <li class="sidebar-menu_buttons_button">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M10.4355 10.935C10.3152 10.9643 10.1942 10.9903 10.0725 11.013C9.41206 11.1373 8.73399 11.1348 8.0745 11.0055C7.959 10.983 7.7955 10.9432 7.58475 10.887L6.894 11.7847C5.18925 11.73 4.54125 10.5877 4.54125 10.5877C4.54125 8.052 5.652 5.99625 5.652 5.99625C6.76275 5.1465 7.8195 5.16975 7.8195 5.16975L8.12175 5.5635C8.14961 5.5596 8.17764 5.55709 8.20575 5.556C8.7819 5.47963 9.36578 5.48215 9.94125 5.5635L10.2727 5.16975C10.2727 5.16975 11.3302 5.1465 12.4403 5.997C12.4403 5.997 13.5518 8.052 13.5518 10.5877C13.5518 10.5877 12.8955 11.7292 11.1908 11.7847L10.4355 10.9342V10.935ZM7.557 8.25C7.10625 8.25 6.75 8.5875 6.75 9C6.75 9.4125 7.11375 9.75 7.557 9.75C8.007 9.75 8.36325 9.4125 8.36325 9C8.37075 8.5875 8.00775 8.25 7.557 8.25ZM10.443 8.25C9.993 8.25 9.63675 8.5875 9.63675 9C9.63675 9.4125 10.0005 9.75 10.443 9.75C10.8938 9.75 11.25 9.4125 11.25 9C11.25 8.5875 10.8938 8.25 10.443 8.25ZM15.75 17.25L12.0075 13.5H14.25V3H3.75V13.5H12.0023L12.4298 15H3.75C3.35218 15 2.97064 14.842 2.68934 14.5607C2.40804 14.2794 2.25 13.8978 2.25 13.5V3C2.25 2.60218 2.40804 2.22064 2.68934 1.93934C2.97064 1.65804 3.35218 1.5 3.75 1.5H14.25C14.6478 1.5 15.0294 1.65804 15.3107 1.93934C15.592 2.22064 15.75 2.60218 15.75 3V17.25Z" fill="currentColor"/>
        </svg>
        <button>
          <a style="margin-left: 8px; font-family: Manrope;" href="https://discord.gg/xgCecaaEsc" target="_blank">Discord</a>
        </button>
      </li>
<!--      <li class="sidebar-menu_buttons_button">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">-->
<!--          <path d="M9.75 13.5V15H14.25V16.5H9.75C9.35218 16.5 8.97064 16.342 8.68934 16.0607C8.40804 15.7794 8.25 15.3978 8.25 15V13.5H6C5.20435 13.5 4.44129 13.1839 3.87868 12.6213C3.31607 12.0587 3 11.2956 3 10.5V5.25C3 5.05109 3.07902 4.86032 3.21967 4.71967C3.36032 4.57902 3.55109 4.5 3.75 4.5H6V1.5H7.5V4.5H10.5V1.5H12V4.5H14.25C14.4489 4.5 14.6397 4.57902 14.7803 4.71967C14.921 4.86032 15 5.05109 15 5.25V10.5C15 11.2956 14.6839 12.0587 14.1213 12.6213C13.5587 13.1839 12.7956 13.5 12 13.5H9.75ZM6 12H12C12.3978 12 12.7794 11.842 13.0607 11.5607C13.342 11.2794 13.5 10.8978 13.5 10.5V8.25H4.5V10.5C4.5 10.8978 4.65804 11.2794 4.93934 11.5607C5.22064 11.842 5.60218 12 6 12ZM13.5 6H4.5V6.75H13.5V6ZM9 10.875C8.80109 10.875 8.61032 10.796 8.46967 10.6553C8.32902 10.5147 8.25 10.3239 8.25 10.125C8.25 9.92609 8.32902 9.73532 8.46967 9.59467C8.61032 9.45402 8.80109 9.375 9 9.375C9.19891 9.375 9.38968 9.45402 9.53033 9.59467C9.67098 9.73532 9.75 9.92609 9.75 10.125C9.75 10.3239 9.67098 10.5147 9.53033 10.6553C9.38968 10.796 9.19891 10.875 9 10.875Z" fill="currentColor"/>-->
<!--        </svg>-->
<!--        <span style="margin-left: 8px; font-family: Manrope;">Integrations</span>-->
<!--      </li>-->
      <router-link to="/profile">
        <li :class="props.selectedPage === Pages.profile ? 'sidebar-menu_buttons_button__selected' : 'sidebar-menu_buttons_button'">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Group">
              <path id="Vector" d="M15 16.5H13.5V15C13.5 14.4033 13.2629 13.831 12.841 13.409C12.419 12.9871 11.8467 12.75 11.25 12.75H6.75C6.15326 12.75 5.58097 12.9871 5.15901 13.409C4.73705 13.831 4.5 14.4033 4.5 15V16.5H3V15C3 14.0054 3.39509 13.0516 4.09835 12.3483C4.80161 11.6451 5.75544 11.25 6.75 11.25H11.25C12.2446 11.25 13.1984 11.6451 13.9017 12.3483C14.6049 13.0516 15 14.0054 15 15V16.5ZM9 9.75C8.40905 9.75 7.82389 9.6336 7.27792 9.40746C6.73196 9.18131 6.23588 8.84984 5.81802 8.43198C5.40016 8.01412 5.06869 7.51804 4.84254 6.97208C4.6164 6.42611 4.5 5.84095 4.5 5.25C4.5 4.65905 4.6164 4.07389 4.84254 3.52792C5.06869 2.98196 5.40016 2.48588 5.81802 2.06802C6.23588 1.65016 6.73196 1.31869 7.27792 1.09254C7.82389 0.866396 8.40905 0.75 9 0.75C10.1935 0.75 11.3381 1.22411 12.182 2.06802C13.0259 2.91193 13.5 4.05653 13.5 5.25C13.5 6.44347 13.0259 7.58807 12.182 8.43198C11.3381 9.27589 10.1935 9.75 9 9.75ZM9 8.25C9.79565 8.25 10.5587 7.93393 11.1213 7.37132C11.6839 6.80871 12 6.04565 12 5.25C12 4.45435 11.6839 3.69129 11.1213 3.12868C10.5587 2.56607 9.79565 2.25 9 2.25C8.20435 2.25 7.44129 2.56607 6.87868 3.12868C6.31607 3.69129 6 4.45435 6 5.25C6 6.04565 6.31607 6.80871 6.87868 7.37132C7.44129 7.93393 8.20435 8.25 9 8.25Z" fill="currentColor"/>
            </g>
          </svg>
          <span style="margin-left: 8px; font-family: Manrope;">Profile</span>
        </li>
      </router-link>
      <li class="sidebar-menu_buttons_button">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_275_307)">
            <path d="M3.33341 12.5003H5.00008V16.667H15.0001V3.33366H5.00008V7.50033H3.33341V2.50033C3.33341 2.27931 3.42121 2.06735 3.57749 1.91107C3.73377 1.75479 3.94573 1.66699 4.16675 1.66699H15.8334C16.0544 1.66699 16.2664 1.75479 16.4227 1.91107C16.579 2.06735 16.6667 2.27931 16.6667 2.50033V17.5003C16.6667 17.7213 16.579 17.9333 16.4227 18.0896C16.2664 18.2459 16.0544 18.3337 15.8334 18.3337H4.16675C3.94573 18.3337 3.73377 18.2459 3.57749 18.0896C3.42121 17.9333 3.33341 17.7213 3.33341 17.5003V12.5003ZM8.33341 9.16699V6.66699L12.5001 10.0003L8.33341 13.3337V10.8337H1.66675V9.16699H8.33341Z" fill="currentColor"/>
          </g>
          <defs>
            <clipPath id="clip0_275_307">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <button @click="exit" style="margin-left: 8px; font-family: Manrope;">Log out</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar-menu {
  z-index: 1;

  display: flex;
  flex-direction: column;
  min-width: 220px;
  background: #FBFBFD;
  box-shadow: 1px 0 0 0 #E9E9EE;
  overflow-x: hidden;
  overflow-y: auto;
}

.sidebar-menu_divider {
  height: 1px;
  flex-shrink: 0;
  width: 100%;

  background: #E9E9EE;
}

.sidebar-menu_buttons {
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem/* 4px */;
}

.sidebar-menu_buttons_button {
  height: 36px;
  border-radius: 4px;
  background: #FBFBFA;
  flex-shrink: 0;

  display: flex;
  place-items: center;

  color: #7A7A79;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.sidebar-menu_buttons_button:hover {
  color: #FF7C5C;
  cursor: pointer;
}

.sidebar-menu_buttons_button__selected {
  height: 36px;
  border-radius: 4px;
  background: #FBFBFA;
  flex-shrink: 0;

  display: flex;
  place-items: center;

  color: #000;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
</style>