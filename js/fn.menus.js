SEMICOLON.Core.getVars.fn.menus = (selector) => {
  const core = SEMICOLON.Core;
  const menus = core.getSelector(selector, false);

  if (menus.length < 1) return true;

  CanvasMenuInit();
  CanvasMenuReset();
  CanvasMenuArrows();
  CanvasMenuInvert();
  CanvasMenuFunctions();
  CanvasMenuTrigger();
  CanvasMenuFullWidth();

  core.getVars.resizers.menus = () => SEMICOLON.Base.menus();
  core.getVars.recalls.menureset = () => CanvasMenuReset();
};

const CanvasMenuPrepareItems = (root = document) => {
  root.querySelectorAll(".menu-item").forEach((item) => {
    const hasSubMenu = item.querySelectorAll(".sub-menu-container").length > 0;

    if (hasSubMenu) {
      item.classList.add("sub-menu");
    }

    if (
      !item.classList.contains("mega-menu-title") &&
      hasSubMenu &&
      item.querySelectorAll(".sub-menu-trigger").length < 1
    ) {
      const trigger = document.createElement("button");
      trigger.classList = "sub-menu-trigger fa-solid fa-chevron-right";
      trigger.type = "button";
      trigger.setAttribute("aria-label", "展开子菜单");
      item.append(trigger);
    }
  });
};

const CanvasMenuInit = () => {
  const core = SEMICOLON.Core;
  const vars = core.getVars;

  vars.headerWrapHeight = vars.elHeaderWrap?.offsetHeight;

  if (!vars.menuOutsideClickBound) {
    document.addEventListener(
      "click",
      (event) => {
        if (!event.target.closest(".primary-menu-trigger") && !event.target.closest(".primary-menu")) {
          CanvasMenuReset();
          CanvasMenuFunctions();
        }

        if (!event.target.closest(".top-links.on-click")) {
          document.querySelectorAll(".top-links.on-click").forEach((topLinks) => {
            topLinks.querySelectorAll(".top-links-sub-menu,.top-links-section").forEach((subMenu) => {
              subMenu.classList.remove("d-block");
            });
          });

          document.querySelectorAll(".top-links.on-click").forEach((topLinks) => {
            topLinks.querySelectorAll(".top-links-item").forEach((item) => {
              item.classList.remove("current");
            });
          });
        }
      },
      false
    );

    vars.menuOutsideClickBound = true;
  }

  CanvasMenuPrepareItems();

  if (!vars.menuMutationObserver) {
    vars.menuMutationObserver = new MutationObserver((mutations) => {
      const hasMenuChange = mutations.some((mutation) => {
        return [...mutation.addedNodes].some((node) => {
          return node.nodeType === 1 && (node.matches?.(".menu-item") || node.querySelector?.(".menu-item"));
        });
      });

      if (!hasMenuChange) return;

      CanvasMenuPrepareItems();
      CanvasMenuArrows();
      CanvasMenuFunctions();
    });

    document.querySelectorAll(".menu-container").forEach((menuContainer) => {
      vars.menuMutationObserver.observe(menuContainer, {
        childList: true,
        subtree: true,
      });
    });
  }
};

const CanvasMenuReset = () => {
  const core = SEMICOLON.Core;
  const body = core.getVars.elBody;

  document.querySelectorAll(".primary-menu-trigger").forEach((trigger) => {
    trigger.classList.remove("primary-menu-trigger-active");
  });

  core.getVars.elPrimaryMenus.forEach((primaryMenu) => {
    if (body.classList.contains("is-expanded-menu")) {
      document.querySelectorAll(".menu-container:not(.mobile-primary-menu)").forEach((menuContainer) => {
        menuContainer.style.display = "";
      });

      if (body.classList.contains("device-xl") || body.classList.contains("device-lg")) {
        core.getVars.elPrimaryMenus.forEach((menu) => {
          menu.querySelectorAll(".mobile-primary-menu")?.forEach((mobileMenu) => {
            mobileMenu.classList.remove("d-block");
          });
        });
      }
    } else if (primaryMenu.classList.contains("mobile-menu-off-canvas")) {
      primaryMenu.querySelector(".menu-container").classList.remove("d-block");
    } else {
      core.slideUp(primaryMenu.querySelector(".menu-container"));
    }

    const bodyClasses = body.className.split(" ").filter((className) => !className.startsWith("primary-menu-open"));
    body.className = bodyClasses.join(" ").trim();
  });

  [...core.getVars.elPrimaryMenus].filter((menu) => menu.matches(".on-click")).forEach((menu) => {
    menu.querySelector(".menu-container").querySelectorAll(".d-block")?.forEach((item) => {
      item.classList.remove("d-block");
    });

    menu.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("current");
    });
  });
};

const CanvasMenuArrows = () => {
  const appendCaret = (target) => {
    if (!target.querySelector(".fa-caret-down")) {
      const caret = document.createElement("i");
      caret.classList.add("fa-solid", "fa-caret-down");
      target.append(caret);
    }
  };

  document.querySelectorAll(".top-links-item").forEach((item) => {
    const link = item.querySelector(":scope > a");

    if (item.querySelector(":scope > .top-links-sub-menu, :scope > .top-links-section")) {
      appendCaret(link);
    }
  });

  document.querySelectorAll(".menu-item").forEach((item) => {
    const linkText = item.querySelector(":scope > .menu-link > div");

    if (
      !item.classList.contains("mega-menu-title") &&
      item.querySelector(":scope > .sub-menu-container, :scope > .mega-menu-content")
    ) {
      appendCaret(linkText);
    }
  });

  document.querySelectorAll(".page-menu-item").forEach((item) => {
    const linkText = item.querySelector(":scope > a > div");

    if (item.querySelector(":scope > .page-menu-sub-menu")) {
      appendCaret(linkText);
    }
  });
};

const CanvasMenuInvert = (targets) => {
  const core = SEMICOLON.Core;
  const menuTargets = targets || document.querySelectorAll(".mega-menu-content, .sub-menu-container, .top-links-section");

  menuTargets.forEach((target) => {
    target.classList.remove("menu-pos-invert");
    target.querySelectorAll(":scope > *").forEach((child) => {
      child.style.display = "block";
    });
    target.style.display = "block";

    const rect = target.getBoundingClientRect();

    if (core.getVars.elBody.classList.contains("rtl") && rect.left < 0) {
      target.classList.add("menu-pos-invert");
    }

    if (core.viewport().width - (rect.left + rect.width) < 0) {
      target.classList.add("menu-pos-invert");
    }
  });

  menuTargets.forEach((target) => {
    target.querySelectorAll(":scope > *").forEach((child) => {
      child.style.display = "";
    });
    target.style.display = "";
  });
};

const CanvasMenuFunctions = () => {
  const core = SEMICOLON.Core;
  const subMenuItems = core.has(document.querySelectorAll(".menu-item"), ".sub-menu-trigger");
  const submenuSelector = ".mega-menu-content, .sub-menu-container";
  const menuItemSelector = ".menu-item";
  const subMenuSelector = ".sub-menu";
  const speed = Number(core.getVars.elPrimaryMenus[0]?.getAttribute("data-trigger-speed") || 200);
  const triggerSelector = ".sub-menu-trigger";
  const bodyClasses = core.getVars.elBody.classList;
  const triggers = document.querySelectorAll(triggerSelector);
  const anchorTriggers = [];

  triggers.forEach((trigger) => {
    const anchor = trigger.closest(".menu-item").querySelector('.menu-link[href^="#"]');

    if (anchor) {
      anchorTriggers.push(anchor);
    }
  });

  const toggleTargets = [...triggers, ...anchorTriggers];

  if (
    (bodyClasses.contains("side-header") && core.getVars.elPrimaryMenus[0].classList.contains("on-click")) ||
    !bodyClasses.contains("is-expanded-menu")
  ) {
    document.querySelectorAll(triggerSelector).forEach((trigger) => {
      trigger.classList.remove("icon-rotate-90");
    });

    core.getVars.elPrimaryMenus.forEach((primaryMenu) => {
      primaryMenu.querySelectorAll(submenuSelector).forEach((submenu) => {
        core.slideUp(submenu, speed, () => bodyClasses.remove("primary-menu-open"));
      });
    });

    toggleTargets.forEach((target) => {
      target.onclick = (event) => {
        const trigger = target.classList.contains("sub-menu-trigger")
          ? target
          : target.closest(menuItemSelector).querySelector(`:scope > ${triggerSelector}`);

        core.siblings(trigger.closest(subMenuSelector)).forEach((sibling) => {
          sibling.querySelector(triggerSelector)?.classList.remove("icon-rotate-90");
        });

        core.siblings(trigger.closest(subMenuSelector)).forEach((sibling) => {
          sibling.querySelectorAll(submenuSelector).forEach((submenu) => {
            core.slideUp(submenu, speed);
          });
        });

        core.slideToggle(trigger.closest(menuItemSelector).querySelector(`:scope > ${submenuSelector}`), speed);
        trigger.classList.toggle("icon-rotate-90");
        event.preventDefault();
      };
    });
  }

  [...core.getVars.elPrimaryMenus].filter((menu) => menu.matches(".on-click")).forEach((primaryMenu) => {
    if (bodyClasses.contains("overlay-menu") && bodyClasses.contains("is-expanded-menu")) {
      subMenuItems.forEach((item) => {
        const link = item.querySelector(":scope > .menu-link");

        link.onclick = (event) => {
          core.siblings(link.closest(subMenuSelector)).forEach((sibling) => {
            sibling.querySelectorAll(submenuSelector).forEach((submenu) => core.slideUp(submenu, speed));
          });

          core.slideToggle(link.closest(menuItemSelector).querySelector(`:scope > ${submenuSelector}`), speed);
          event.preventDefault();
        };
      });
    } else {
      subMenuItems.forEach((item) => {
        const link = item.querySelector(":scope > .menu-link");

        link.onclick = (event) => {
          core.siblings(link.closest(subMenuSelector)).forEach((sibling) => {
            sibling.querySelectorAll(submenuSelector).forEach((submenu) => submenu.classList.remove("d-block"));
          });

          link.closest(menuItemSelector).querySelector(`:scope > ${submenuSelector}`).classList.toggle("d-block");
          core.siblings(link.closest(menuItemSelector)).forEach((sibling) => sibling.classList.remove("current"));
          link.closest(menuItemSelector).classList.toggle("current");
          event.preventDefault();
        };
      });
    }
  });

  if ((bodyClasses.contains("overlay-menu") || bodyClasses.contains("side-header")) && bodyClasses.contains("is-expanded-menu")) {
    [...core.getVars.elPrimaryMenus].filter((menu) => !menu.matches(".on-click")).forEach((primaryMenu) => {
      primaryMenu.querySelectorAll(submenuSelector).forEach((submenu) => {
        core.slideUp(submenu, speed);
      });
    });

    document.querySelectorAll(subMenuSelector).forEach((item) => {
      if (!item.closest(".primary-menu.on-click")) {
        const submenu = item.querySelector(`:scope > ${submenuSelector}`);

        item.onmouseover = () => {
          core.slideDown(submenu, speed);
        };

        item.onmouseout = () => {
          core.slideUp(submenu, speed);
        };
      }
    });
  }

  document.querySelectorAll(".top-links").forEach((topLinks) => {
    if (!topLinks.classList.contains("on-click") && bodyClasses.contains("device-up-lg")) return;

    document.querySelectorAll(".top-links-item").forEach((item) => {
      if (item.querySelectorAll(".top-links-sub-menu,.top-links-section").length > 0) {
        const link = item.querySelector(":scope > a");

        link.onclick = (event) => {
          core.siblings(item).forEach((sibling) => {
            sibling.querySelectorAll(".top-links-sub-menu, .top-links-section").forEach((submenu) => {
              submenu.classList.remove("d-block");
            });
          });

          item.querySelector(":scope > .top-links-sub-menu, :scope > .top-links-section").classList.toggle("d-block");
          core.siblings(item).forEach((sibling) => sibling.classList.remove("current"));
          item.classList.toggle("current");
          event.preventDefault();
        };
      }
    });
  });

  CanvasMenuInvert(document.querySelectorAll(".top-links-section"));
};

const CanvasMenuTrigger = () => {
  const core = SEMICOLON.Core;
  const bodyClasses = core.getVars.elBody.classList;
  const speed = Number(core.getVars.elPrimaryMenus[0]?.getAttribute("data-trigger-speed") || 200);

  document.querySelectorAll(".primary-menu-trigger").forEach((trigger) => {
    trigger.onclick = (event) => {
      const targetSelector = trigger.getAttribute("data-target") || "*";

      if (core.filtered(core.getVars.elPrimaryMenus, targetSelector).length < 1) return;

      if (!bodyClasses.contains("is-expanded-menu")) {
        core.getVars.elPrimaryMenus.forEach((primaryMenu) => {
          if (primaryMenu.querySelectorAll(".mobile-primary-menu").length > 0) {
            if (primaryMenu.classList.contains("mobile-menu-off-canvas")) {
              if (primaryMenu.matches(targetSelector)) {
                primaryMenu.querySelectorAll(".mobile-primary-menu").forEach((menu) => menu.classList.toggle("d-block"));
              }
            } else if (primaryMenu.matches(targetSelector)) {
              primaryMenu.querySelectorAll(".mobile-primary-menu").forEach((menu) => core.slideToggle(menu, speed));
            }
          } else if (primaryMenu.classList.contains("mobile-menu-off-canvas")) {
            if (primaryMenu.matches(targetSelector)) {
              primaryMenu.querySelectorAll(".menu-container").forEach((menu) => menu.classList.toggle("d-block"));
            }
          } else if (primaryMenu.matches(targetSelector)) {
            primaryMenu.querySelectorAll(".menu-container").forEach((menu) => core.slideToggle(menu, speed));
          }
        });
      }

      trigger.classList.toggle("primary-menu-trigger-active");

      [...core.getVars.elPrimaryMenus].filter((primaryMenu) => primaryMenu.matches(targetSelector)).forEach((primaryMenu) => {
        primaryMenu.classList.toggle("primary-menu-active");
      });

      bodyClasses.toggle("primary-menu-open");

      if (targetSelector !== "*") {
        bodyClasses.toggle(`primary-menu-open-${targetSelector.replace(/[^a-zA-Z0-9-]/g, "")}`);
      } else {
        bodyClasses.toggle("primary-menu-open-all");
      }

      event.preventDefault();
    };
  });
};

const CanvasMenuFullWidth = () => {
  const core = SEMICOLON.Core;
  const bodyClasses = core.getVars.elBody.classList;

  if (!bodyClasses.contains("is-expanded-menu")) {
    document.querySelectorAll(".mega-menu-content, .top-search-form").forEach((target) => {
      target.style.width = "";
    });

    return true;
  }

  const headerRowWidth = document.querySelector(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content")?.closest(".header-row").offsetWidth;

  if (core.getVars.elHeader.querySelectorAll(".container-fullwidth").length > 0) {
    document.querySelectorAll(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content").forEach((content) => {
      content.style.width = `${headerRowWidth}px`;
    });
  }

  document.querySelectorAll(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content, .top-search-form").forEach((content) => {
    content.style.width = `${headerRowWidth}px`;
  });

  if (core.getVars.elHeader.classList.contains("full-header")) {
    document.querySelectorAll(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content").forEach((content) => {
      content.style.width = `${headerRowWidth}px`;
    });
  }

  if (core.getVars.elHeader.classList.contains("floating-header")) {
    const floatingPadding = getComputedStyle(document.querySelector("#header")).getPropertyValue("--cnvs-header-floating-padding");

    document.querySelectorAll(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content").forEach((content) => {
      content.style.width = `${headerRowWidth + 2 * Number(floatingPadding.split("px")[0])}px`;
    });
  }

  if (core.getVars.elHeader.querySelectorAll(".header-row").length > 1) {
    const topOffset =
      core.getVars.headerWrapHeight -
      (document.querySelector(".menu-container > .mega-menu:not(.mega-menu-small) .mega-menu-content")?.closest(".header-row").offsetHeight || 0);
    const styleText = `.menu-container > .mega-menu:not(.mega-menu-small) .mega-menu-content { top: calc( 100% - ${topOffset}px ); }`;
    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");

    head.appendChild(style);
    style.type = "text/css";
    style.appendChild(document.createTextNode(styleText));
  }
};
