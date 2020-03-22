import { BaseView } from "../baseView";
import { HtmlString } from "../../models/iView";

export class AboutApp extends BaseView {
    protected doDestroySelf(): void {
    }

    protected doInit(): HtmlString {
        return `
            <h2>About this App</h2>
            <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe beatae perferendis aliquam a et exercitationem suscipit, dolorem adipisci assumenda, aperiam veritatis quam, culpa cum! Expedita dignissimos nobis accusantium esse dolore ratione aspernatur eius? Commodi deleniti consequuntur eius omnis, error ea explicabo vel veritatis soluta dolores maiores quod eos nemo labore odit debitis doloribus iure laborum adipisci. Quo, maiores maxime. Harum tenetur ducimus nulla porro illo, fuga praesentium tempora! Itaque quos eligendi sunt omnis consectetur excepturi maxime perferendis molestias amet cum sint autem id nesciunt, magnam accusamus iure? Magnam id voluptatibus sit quam corporis adipisci nemo commodi facilis, consectetur ex excepturi!</p>
        `;
    }

    protected onPlacedInDocument(): void {
    }


}

