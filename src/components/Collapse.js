// Collapsible.js
import React from 'react';
class Collapse extends React.Component {
constructor(props){
super(props);
this.state = {
open: false
}
this.togglePanel = this.togglePanel.bind(this);
}

togglePanel(e){
this.setState({open: !this.state.open})
}

render() {
return (<div>
<div onClick={(e)=>this.togglePanel(e)} className='header'>
{this.props.title}</div>
{this.state.open ? (
<div className='content'>
{this.props.children}
</div>
) : null}
</div>);
}
}
export default Collapse;

/* CSS */
/*
.header{
cursor: pointer;
border: solid 1px #f2f2f2;
padding: 15px;
background-color: #0089CC;
color: #FFF;
font-family: verdana;
}

.content{
cursor: pointer;
border-left: solid 1px #f2f2f2;
border-right: solid 1px #f2f2f2;
border-bottom: solid 1px #f2f2f2;
border-radius: 0 0 5px 5px;
padding: 15px;
font-family: verdana;
font-size: 14px;
}
*/
