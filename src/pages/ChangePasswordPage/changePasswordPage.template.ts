export default `
  <div class="back">
      <a href="/"></a>
  </div>
  <div class="user">
      <div class="avatar">
        <img src="{{defaultAvatar}}" alt="default_avatar">
      </div>
      <form class="settings">
          {{{oldPassword}}}
          {{{newPassword}}}
          {{{repeatNewPassword}}}
          {{{saveButton}}}
      </form>
  </div>
`;