/**
 * AlgoRealm
 * Copyright (C) 2022 AlgoRealm
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesContainer = () => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: `#000000`,
        },
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        particles: {
          color: { value: `random` },
          line_linked: {
            enable: true,
            opacity: 0.02,
          },
          move: {
            direction: `right`,
            speed: 0.05,
          },
          rotate: {
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },
          number: {
            density: { enable: true, area: 800 },
            value: 100,
          },
          opacity: {
            animation: {
              enable: true,
              minimumValue: 0.5,
              speed: 1,
              sync: false,
            },
            random: false,
            value: 1,
          },
          shape: {
            character: [
              {
                fill: true,
                font: `Verdana`,
                value: [`🏰`, `⛓`, `👑`, `🪄`],
                style: ``,
                weight: `400`,
              },
            ],
            image: {
              height: 100,
              replace_color: true,
              src: `images/github.svg`,
              width: 100,
            },
            polygon: { nb_sides: 5 },
            stroke: { color: `random`, width: 1 },
            type: `char`,
          },
          size: {
            value: 8,
          },
        },
        interactivity: {
          events: {
            onclick: {
              enable: true,
              mode: `push`,
            },
          },
          modes: {
            push: {
              particles_nb: 1,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesContainer;
