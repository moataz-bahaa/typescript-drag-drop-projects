/// <reference path="components/project-input.ts"/>
/// <reference path="components/project-list.ts"/>

namespace App {
  const projectInput = new ProjectInput();
  const activePrjList = new ProjectList('active');
  const finishedPrjList = new ProjectList('finished');
}
