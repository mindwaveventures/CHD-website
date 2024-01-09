import React from 'react';

import ReactTooltip, { Effect, Place, Type } from 'react-tooltip';


interface TooltipProps {
  id?: string;
  place?: Place;
  type?: Type;
  effect?: Effect;
  multiline?: boolean;
  children: any;
  status:boolean;
}


const Tooltip: React.FC<TooltipProps> = ({
  id,
  place,
  type,
  effect,
  multiline,
  children,
  status,

}) => {
  return (
   <> {status &&

    <ReactTooltip
      id={id}
      place={place}
      type={type}
      effect={effect}
      multiline={multiline}
    >
      {children}      
    </ReactTooltip> 
    
    }
     </> 
  );
};
export default Tooltip;