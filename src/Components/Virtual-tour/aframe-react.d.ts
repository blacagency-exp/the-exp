declare module "aframe-react" {
    import * as React from "react";
  
    export interface EntityProps {
      [key: string]: unknown;
    }
  
    export const Entity: React.FC<EntityProps>;
    export const Scene: React.FC<EntityProps>;
  }