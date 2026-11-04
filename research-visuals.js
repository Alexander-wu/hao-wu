/* Native SVG illustrations for the research-area previews.
 * Motion is supplied by CSS: rv-spin, rv-pulse, rv-flow, rv-float.
 * rv-globe-drift translates from 0 to -144px over 28s, linearly, forever.
 * Disable every animation under the preview for prefers-reduced-motion.
 */
(() => {
  const cyan = '#167e89', blue = '#416fa8', lavender = '#8d65ac', ink = '#213b55';
  const scene = (name, body, extraDefs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="rv-${name}-glow"><stop stop-color="${blue}" stop-opacity=".2"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
      <linearGradient id="rv-${name}-line" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${cyan}"/><stop offset="1" stop-color="${lavender}"/></linearGradient>
      <linearGradient id="rv-${name}-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${blue}" stop-opacity=".13"/><stop offset="1" stop-color="${cyan}" stop-opacity=".025"/></linearGradient>
      ${extraDefs}
    </defs>
    <ellipse cx="183" cy="103" rx="163" ry="100" fill="url(#rv-${name}-glow)"/>
    <g fill="none" stroke="${blue}" stroke-width=".7" opacity=".12"><path d="M28 50H332M28 100H332M28 150H332M80 20V180M130 20V180M180 20V180M230 20V180M280 20V180"/></g>
    <g fill="${ink}" opacity=".25"><circle cx="36" cy="32" r="1"/><circle cx="321" cy="29" r="1"/><circle cx="29" cy="170" r="1"/><circle cx="327" cy="166" r="1"/></g>
    <g fill="none" stroke="${cyan}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${body}</g>
  </svg>`;
  const dot = (x, y, color = cyan, radius = 3) => `<circle cx="${x}" cy="${y}" r="${radius + 4}" fill="${color}" fill-opacity=".08" stroke="none"/><circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" stroke="none"/>`;
  const label = (x, y, text, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${ink}" fill-opacity=".55" stroke="none" font-family="inherit" font-size="8" letter-spacing="1.2">${text}</text>`;
  const cube = (x, y, size, opacity = 1) => `<g transform="translate(${x} ${y})" opacity="${opacity}"><path d="M0 0 ${size} ${-size / 2} ${2 * size} 0 ${size} ${size / 2}Z" fill="${cyan}" fill-opacity=".17"/><path d="M0 0v${size}l${size} ${size / 2} ${size} ${-size / 2}V0M${size} ${size / 2}v${size}"/><path d="M${size} ${size / 2} ${2 * size} 0v${size}l${-size} ${size / 2}Z" fill="${blue}" fill-opacity=".13"/></g>`;

  window.RESEARCH_VISUALS = {
    selected: {
      label: 'Selected Research',
      caption: 'Ideas connected across worlds, science, and intelligence.',
      icon: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
      scene: scene('selected', `
        <ellipse cx="180" cy="102" rx="121" ry="64" transform="rotate(-12 180 102)" stroke="${blue}" stroke-opacity=".24" stroke-dasharray="2 7"/>
        <g stroke="url(#rv-selected-line)" stroke-opacity=".36"><path d="M71 64 180 103 279 58M180 103 289 143M180 103 75 148M180 103 183 29"/><path d="M71 64 183 29 279 58 289 143 75 148Z" stroke-opacity=".18"/></g>
        <path class="rv-flow" d="M71 64 180 103 289 143M75 148 180 103 279 58" stroke="url(#rv-selected-line)" stroke-dasharray="4 25"/>
        <g class="rv-pulse"><circle cx="180" cy="103" r="31" stroke="${cyan}" stroke-opacity=".15"/><circle cx="180" cy="103" r="23" fill="${cyan}" fill-opacity=".035" stroke-opacity=".28"/></g>
        <g class="rv-float"><path d="m180 84 5.2 13.8L199 103l-13.8 5.2L180 122l-5.2-13.8L161 103l13.8-5.2Z" fill="${cyan}" fill-opacity=".1" stroke="${ink}" stroke-width="1.6"/><circle cx="180" cy="103" r="3" fill="${ink}" stroke="none"/></g>
        <g transform="translate(71 64)"><circle r="14" fill="#f8fbfd" stroke="${blue}"/><path d="m-6-3 6-3 6 3v7l-6 3-6-3Zm0 0 6 3 6-3M0 0v7" stroke="${blue}"/></g>
        <g transform="translate(279 58)"><circle r="14" fill="#f8fbfd" stroke="${lavender}"/><path d="M-8 2q4-11 8 0t8 0M-8 6q4-11 8 0t8 0" stroke="${lavender}"/></g>
        <g transform="translate(289 143)"><circle r="14" fill="#f8fbfd"/><circle r="7"/><ellipse rx="3" ry="7"/><path d="M-7 0H7"/></g>
        <g transform="translate(75 148)"><circle r="14" fill="#f8fbfd" stroke="${lavender}"/><path d="M0-7 7-4v5q-1 5-7 7-6-2-7-7v-5Z" stroke="${lavender}"/><path d="m-3 0 2 2 4-4" stroke="${lavender}"/></g>
        ${dot(183, 29, ink, 3)}${dot(129, 85, cyan, 1.7)}${dot(233, 123, lavender, 1.7)}
        ${label(180, 174, 'CONNECTED QUESTIONS')}`)
    },
    all: {
      label: 'All Papers',
      caption: 'Explore the full collection and the ideas linking it.',
      icon: '<rect x="6" y="3" width="12" height="15" rx="2"/><path d="M3 7v12a2 2 0 0 0 2 2h10M9 7h6M9 11h6M9 15h3"/>',
      scene: scene('all', `
        <path d="M82 111v31q0 12 12 12h172q12 0 12-12v-23M180 116v38" stroke="${blue}" stroke-opacity=".4"/>
        <path class="rv-flow" d="M82 111v31q0 12 12 12h172q12 0 12-12v-23" stroke-dasharray="3 15"/>
        <g class="rv-float" style="animation-delay:-1s"><rect x="45" y="51" width="74" height="73" rx="7" fill="url(#rv-all-glass)" stroke="${blue}" stroke-opacity=".65"/><path d="M58 65h24M58 71h39M58 77h31" stroke="${ink}" stroke-opacity=".4"/><path d="M59 110V91h45M63 105l9-10 10 5 15-14" stroke="${blue}"/>${dot(97, 86, blue, 2)}</g>
        <g class="rv-float" style="animation-delay:-2.4s"><rect x="243" y="55" width="74" height="73" rx="7" fill="url(#rv-all-glass)" stroke="${lavender}" stroke-opacity=".65"/><path d="M256 69h26M256 75h44M256 81h30" stroke="${ink}" stroke-opacity=".4"/><path d="m260 111 13-16 18 12 13-13M273 95l18 12" stroke="${lavender}"/>${dot(273, 95, lavender, 2)}${dot(291, 107, lavender, 2)}</g>
        <g class="rv-float"><rect x="132" y="34" width="96" height="96" rx="8" fill="#f8fbfd" stroke="url(#rv-all-line)" stroke-width="1.5"/><path d="M148 51h33M148 59h61M148 67h49" stroke="${ink}" stroke-opacity=".6"/><path d="M150 114V82h60" stroke-opacity=".3"/><path d="M153 107c13 0 13-17 26-17s16 22 27-4" stroke="url(#rv-all-line)" stroke-width="1.8"/><path d="M153 107c13 0 13-17 26-17s16 22 27-4v28h-53Z" fill="${cyan}" fill-opacity=".05" stroke="none"/></g>
        <circle class="rv-pulse" cx="180" cy="154" r="11" fill="#f8fbfd" stroke="${cyan}" stroke-opacity=".5"/>${dot(180, 154, ink, 3)}
        ${label(180, 183, 'A LIBRARY OF IDEAS')}`)
    },
    world: {
      label: 'World Models',
      caption: 'Learn dynamics. Imagine futures. Act in the world.',
      icon: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="m9 8 6 3-6 3ZM8 21h8M12 18v3"/>',
      scene: scene('world', `
        <path d="M37 145c82 27 204 27 290-12" stroke="${blue}" stroke-opacity=".32"/>
        <path class="rv-flow" d="M37 145c82 27 204 27 290-12" stroke-dasharray="4 12"/>
        <g stroke="${blue}" stroke-opacity=".5"><rect x="31" y="55" width="88" height="79" rx="7" fill="url(#rv-world-glass)"/><path d="M32 110h86M45 133l26-23M97 133l-14-23M32 121h86" stroke-opacity=".25"/></g>
        <g stroke="${cyan}"><rect x="134" y="44" width="94" height="90" rx="7" fill="url(#rv-world-glass)" stroke-opacity=".75"/><path d="M135 106h92M148 133l27-27M216 133l-24-27M135 119h92" stroke-opacity=".2"/></g>
        <g stroke="${lavender}"><rect x="243" y="31" width="88" height="103" rx="7" fill="url(#rv-world-glass)" stroke-opacity=".8" stroke-dasharray="4 4"/><path d="M244 102h86M252 133l29-31M322 133l-28-31M244 118h86" stroke-opacity=".2"/></g>
        ${cube(56, 95, 13, .55)}
        <g class="rv-float">${cube(165, 88, 15, .9)}</g>
        <g class="rv-float" style="animation-delay:-1.2s" stroke="${lavender}">${cube(271, 76, 16)}</g>
        <path d="M121 92h10m-4-3 4 3-4 3M230 85h10m-4-3 4 3-4 3" stroke="${ink}" stroke-opacity=".6"/>
        ${label(75, 70, 'OBSERVE')}${label(181, 59, 'MODEL')}${label(287, 46, 'IMAGINE')}
        <g transform="translate(157 158)"><rect width="48" height="22" rx="11" fill="${cyan}" fill-opacity=".06" stroke-opacity=".4"/><path d="M12 11h8m-4-4v8M31 9h.1M35 13h.1" stroke="${ink}" stroke-width="1.7"/></g>
        <path d="M181 156v-14m-3 3 3-3 3 3" stroke-opacity=".5"/>`)
    },
    sciml: {
      label: 'Scientific Machine Learning',
      caption: 'Learning operators that connect data and physical systems.',
      icon: '<path d="M3 8c3-7 6 7 9 0s6 7 9 0M3 16c3-7 6 7 9 0s6 7 9 0"/>',
      scene: scene('sciml', `
        <g stroke="${blue}" stroke-opacity=".2"><path d="M37 146 177 176 323 130M37 146V61M177 176v-82M323 130V54"/><path d="m65 152 145-89M94 158 145-89M122 164 145-89M150 170 145-89" stroke-dasharray="2 6"/></g>
        <g stroke="url(#rv-sciml-line)">
          <path d="M37 113c35-65 69-62 105-17s71 52 106 8 49-47 75-28" stroke-opacity=".25"/>
          <path d="M37 122c35-65 69-62 105-17s71 52 106 8 49-47 75-28" stroke-opacity=".4"/>
          <path d="M37 131c35-65 69-62 105-17s71 52 106 8 49-47 75-28" stroke-opacity=".65"/>
          <path d="M37 140c35-65 69-62 105-17s71 52 106 8 49-47 75-28" stroke-width="1.8"/>
          <path d="M37 149c35-65 69-62 105-17s71 52 106 8 49-47 75-28" stroke-opacity=".45"/>
          <path d="M37 158c35-65 69-62 105-17s71 52 106 8 49-47 75-28" stroke-opacity=".2"/>
        </g>
        <path class="rv-flow" d="M37 131c35-65 69-62 105-17s71 52 106 8 49-47 75-28" stroke="${ink}" stroke-width="2" stroke-dasharray="1 35"/>
        <g class="rv-float"><rect x="147" y="24" width="68" height="33" rx="7" fill="#f8fbfd" stroke="${lavender}" stroke-opacity=".65"/><path d="M161 41h11m-4-4 4 4-4 4M190 35v12m-5-9h10m-10 6h10" stroke="${lavender}"/><path d="M181 58v35" stroke="${lavender}" stroke-opacity=".4" stroke-dasharray="2 5"/></g>
        ${dot(81, 96, cyan, 3)}${dot(185, 145, lavender, 3)}${dot(288, 89, ink, 3)}
        ${label(55, 51, 'FIELD', 'start')}${label(313, 164, 'OPERATOR', 'end')}`)
    },
    earth: {
      label: 'Earth Systems',
      caption: 'Modeling a connected planet, from atmosphere to ocean.',
      icon: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/>',
      scene: scene('earth', `
        <ellipse cx="181" cy="99" rx="116" ry="31" transform="rotate(-19 181 99)" stroke="${blue}" stroke-opacity=".26"/>
        <path class="rv-flow" d="M71 132c47 9 172-24 220-62" stroke="${cyan}" stroke-opacity=".6" stroke-dasharray="3 13"/>
        <circle cx="181" cy="99" r="64" fill="url(#rv-earth-glass)" stroke="url(#rv-earth-line)" stroke-width="1.4"/>
        <g clip-path="url(#rv-earth-clip)"><g class="rv-globe-drift" fill="${cyan}" fill-opacity=".26" stroke="${cyan}" stroke-width="1" stroke-opacity=".85"><use href="#rv-earth-land" x="109" y="37"/><use href="#rv-earth-land" x="253" y="37"/></g>
          <g stroke="${blue}" stroke-opacity=".55" stroke-width=".8"><ellipse cx="181" cy="99" rx="21" ry="64"/><ellipse cx="181" cy="99" rx="46" ry="64"/><path d="M117 99h128M125 68q56 15 112 0M125 130q56-15 112 0M139 48q42 13 84 0M139 150q42-13 84 0"/></g>
          <path d="M119 114c28-33 63 17 100-14s40 1 47 7M113 85c47 34 74-19 126 10" stroke="${ink}" stroke-opacity=".3" stroke-width=".8"/>
        </g>
        <circle class="rv-pulse" cx="181" cy="99" r="69" stroke="${cyan}" stroke-opacity=".11"/>
        <g class="rv-spin" style="animation-duration:35s"><circle cx="181" cy="99" r="83" stroke="${blue}" stroke-opacity=".15" stroke-dasharray="2 10"/>${dot(181, 16, lavender, 2.5)}${dot(181, 182, cyan, 2.5)}</g>
        <g transform="translate(284 65) rotate(-19)"><rect x="-5" y="-5" width="10" height="10" rx="2" fill="#f8fbfd"/><path d="M-16-5h8V5h-8ZM8-5h8V5H8Z" fill="${blue}" fill-opacity=".16" stroke="${lavender}"/></g>
        ${label(44, 170, 'ATMOSPHERE', 'start')}${label(316, 170, 'OCEAN', 'end')}`,
        `<clipPath id="rv-earth-clip"><circle cx="181" cy="99" r="63.5"/></clipPath>
         <path id="rv-earth-land" d="M7 24 18 16 28 19 36 15 48 23 55 30 48 36 45 46 36 50 34 59 26 53 23 43 15 38 11 30ZM45 61 56 61 68 69 66 80 60 88 57 104 51 113 47 100 45 86 39 76ZM65 8 77 5 82 14 76 23 68 20ZM75 33 83 27 88 29 92 25 100 28 103 36 92 40 87 46 77 42ZM78 47 90 43 101 53 100 67 93 80 86 86 80 75 74 66 73 55ZM99 28 111 20 124 23 136 32 140 42 130 48 127 57 117 59 112 50 105 48 102 40ZM116 65 123 64 128 70 137 74 134 79 124 75ZM116 89 128 84 139 91 136 101 124 105 115 99Z"/>`)
    },
    multimodal: {
      label: 'Multimodal & Agents',
      caption: 'Connecting perception, language, and action.',
      icon: '<rect x="8" y="8" width="8" height="8" rx="2"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/><circle cx="12" cy="2.5" r="1"/><circle cx="21.5" cy="12" r="1"/><circle cx="12" cy="21.5" r="1"/><circle cx="2.5" cy="12" r="1"/>',
      scene: scene('multimodal', `
        <g stroke="${blue}" stroke-opacity=".35"><path d="M96 63c35 0 42 37 66 37M265 60c-34 0-43 40-67 40M105 146c36 0 35-35 57-35M264 145c-32 0-41-34-66-34"/></g>
        <path class="rv-flow" d="M96 63c35 0 42 37 66 37M265 60c-34 0-43 40-67 40M105 146c36 0 35-35 57-35M198 111c23 0 32 34 66 34" stroke="url(#rv-multimodal-line)" stroke-dasharray="3 14"/>
        <circle cx="180" cy="105" r="39" stroke="${blue}" stroke-opacity=".15" stroke-dasharray="2 6"/>
        <g class="rv-pulse"><rect x="158" y="83" width="44" height="44" rx="12" fill="${cyan}" fill-opacity=".06" stroke="url(#rv-multimodal-line)"/><path d="M170 98h20v14h-20ZM180 92v6M166 104h4M190 104h4M176 117h8"/><circle cx="176" cy="104" r="1" fill="${ink}"/><circle cx="184" cy="104" r="1" fill="${ink}"/></g>
        <g class="rv-float"><rect x="42" y="40" width="66" height="43" rx="7" fill="#f8fbfd" stroke="${blue}"/><path d="M55 52h38M55 59h27M55 66h33" stroke="${ink}" stroke-opacity=".65"/>${label(75, 96, 'LANGUAGE')}</g>
        <g class="rv-float" style="animation-delay:-1.1s"><rect x="252" y="35" width="64" height="47" rx="7" fill="#f8fbfd" stroke="${lavender}"/><path d="m261 71 14-15 10 9 8-7 14 13Z" fill="${lavender}" fill-opacity=".1" stroke="${lavender}"/><circle cx="297" cy="48" r="3" stroke="${lavender}"/>${label(284, 95, 'VISION')}</g>
        <g class="rv-float" style="animation-delay:-2s"><rect x="48" y="126" width="66" height="36" rx="7" fill="#f8fbfd"/><path d="M60 142v4M66 136v16M72 132v24M78 139v10M84 135v18M90 139v10M96 142v4M102 137v14" stroke="${cyan}"/>${label(81, 178, 'AUDIO')}</g>
        <g class="rv-float" style="animation-delay:-3s"><rect x="250" y="126" width="66" height="36" rx="7" fill="#f8fbfd" stroke="${lavender}"/><path d="M263 147h14v-9h25m-5-4 5 4-5 4" stroke="${lavender}"/>${dot(263, 147, lavender, 2)}${label(283, 178, 'ACTION')}</g>`)
    },
    safety: {
      label: 'Reinforcement Learning & Safety',
      caption: 'Learning actions with feedback, constraints, and care.',
      icon: '<path d="M12 3 20 6v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
      scene: scene('safety', `
        <path d="M46 109h59c38 0 38-46 75-46h88M105 109c38 0 38 39 75 39h88" stroke="${blue}" stroke-opacity=".28"/>
        <path d="M105 109h85" stroke="${blue}" stroke-opacity=".3" stroke-dasharray="4 5"/>
        <path class="rv-flow" d="M46 109h59c38 0 38-46 75-46h88" stroke="${cyan}" stroke-width="1.8" stroke-dasharray="6 9"/>
        <path d="M280 82v70q0 23-23 23H89q-23 0-23-23v-9m-4 5 4-5 4 5" stroke="${lavender}" stroke-opacity=".45"/>
        <path class="rv-flow" d="M280 82v70q0 23-23 23H89q-23 0-23-23v-9" stroke="${lavender}" stroke-dasharray="2 20" stroke-opacity=".75"/>
        <circle cx="46" cy="109" r="11" fill="#f8fbfd" stroke-opacity=".65"/>${dot(46, 109, ink, 3)}
        ${dot(105, 109, cyan, 4)}${dot(180, 63, cyan, 3)}${dot(180, 148, blue, 3)}
        <g stroke="${blue}" stroke-opacity=".45"><circle cx="202" cy="109" r="10" fill="#f8fbfd"/><path d="M198 109h8"/><circle cx="278" cy="148" r="10" fill="#f8fbfd"/><path d="M274 148h8"/></g>
        <g class="rv-float"><path d="m278 29 24 9v21c0 17-24 29-24 29s-24-12-24-29V38Z" fill="${cyan}" fill-opacity=".07" stroke="url(#rv-safety-line)" stroke-width="1.6"/><path d="m266 57 8 8 17-19" stroke="${ink}" stroke-width="2"/></g>
        <path class="rv-pulse" d="m278 21 31 12v26c0 22-31 37-31 37s-31-15-31-37V33Z" stroke="${cyan}" stroke-opacity=".13"/>
        ${label(47, 87, 'STATE')}${label(177, 47, 'POLICY')}${label(168, 190, 'FEEDBACK')}`)
    }
  };
})();
