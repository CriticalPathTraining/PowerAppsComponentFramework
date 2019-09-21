import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class RollingDice implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private context: ComponentFramework.Context<IInputs>;
	private hostContainer: HTMLDivElement;
	private topContainer: HTMLDivElement;
	private btnRollDice: HTMLButtonElement;
	private imageDie1: HTMLImageElement;
	private imageDie2: HTMLImageElement;

	private refreshData: EventListenerOrEventListenerObject;
	private notifyOutputChanged: () => void;

	static readonly buttonText: string = "Roll Them Dice";
	static readonly buttonTextExecuting: string = "rolling...";


	private myContext: ComponentFramework.Context<IInputs>

	private getRandomDieValue = (): number => {
		return (Math.floor(Math.random() * Math.floor(6)) + 1);
	}

	private valueDie1: number = this.getRandomDieValue();
	private valueDie2: number = this.getRandomDieValue();

	private delay = (ms: number) => {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	public async  onRollDice() {
		// use anonymous async function to call delay() using await
		(async () => {
			this.btnRollDice.innerText = RollingDice.buttonTextExecuting;
			this.imageDie1.src = Images.spinningdie1;
			this.imageDie2.src = Images.spinningdie2;
			
			// pause for 3 seconds for animation
			await this.delay(3000);

			this.valueDie1 = this.getRandomDieValue();
			this.valueDie2 = this.getRandomDieValue();
			this.imageDie1.src = Images.getDieImageUrl(this.valueDie1);
			this.imageDie2.src = Images.getDieImageUrl(this.valueDie2);
			this.btnRollDice.innerText = RollingDice.buttonText;

			this.notifyOutputChanged();

		})();

	}


	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {

		console.log("init", context, state, container);

		this.context = context;
		this.hostContainer = container;
		this.notifyOutputChanged = notifyOutputChanged;

		this.valueDie1 = this.getRandomDieValue();
		this.valueDie2 = this.getRandomDieValue();

		this.topContainer = document.createElement("div");
		this.topContainer.setAttribute("class", "rolling-dice-top-container");

		this.btnRollDice = document.createElement("button");
		this.btnRollDice.setAttribute("class", "button-roll-dice");
		this.btnRollDice.title = RollingDice.buttonText;
		this.btnRollDice.innerText = RollingDice.buttonText;
		this.btnRollDice.onclick = () => { this.onRollDice(); };

		this.imageDie1 = new Image();
		this.imageDie1.src = Images.getDieImageUrl(this.valueDie1);

		this.imageDie2 = new Image();
		this.imageDie2.src = Images.getDieImageUrl(this.valueDie2);

		this.topContainer.appendChild(this.btnRollDice);
		this.topContainer.appendChild(document.createElement("br"));
		this.topContainer.appendChild(this.imageDie1);
		this.topContainer.appendChild(this.imageDie2);

		this.hostContainer.appendChild(this.topContainer);

		this.notifyOutputChanged();

	}


	public updateView(context: ComponentFramework.Context<IInputs>): void {
		let fontSize: string = Math.min((this.hostContainer.clientWidth * 0.1), 48) + "px"
		let diceWidth: string = Math.min((this.hostContainer.clientWidth * 0.42), 240) + "px"
		this.btnRollDice.style.fontSize = fontSize;
		this.imageDie1.style.width = diceWidth;
		this.imageDie2.style.width = diceWidth;
	}

	public getOutputs(): IOutputs {

		let outputs: IOutputs = {
			die1: this.valueDie1,
			die2: this.valueDie2
		};

		return outputs;
	}

	public destroy(){}

}

class Images {

	private static readonly die1: string = "http://classresources.blob.core.windows.net/images/dice1.png";
	private static readonly die2: string = "http://classresources.blob.core.windows.net/images/dice2.png";
	private static readonly die3: string = "http://classresources.blob.core.windows.net/images/dice3.png";
	private static readonly die4: string = "http://classresources.blob.core.windows.net/images/dice4.png";
	private static readonly die5: string = "http://classresources.blob.core.windows.net/images/dice5.png";
	private static readonly die6: string = "http://classresources.blob.core.windows.net/images/dice6.png";
	public static readonly spinningdie1: string = "http://classresources.blob.core.windows.net/images/spinningdie1.png";
	public static readonly spinningdie2: string = "http://classresources.blob.core.windows.net/images/spinningdie2.png";

	public static getDieImageUrl(value: number) {
		switch (value) {
			case 1: { return Images.die1; }
			case 2: { return Images.die2; }
			case 3: { return Images.die3; }
			case 4: { return Images.die4; }
			case 5: { return Images.die5; }
			case 6: { return Images.die6; }
			default: { return ""; }
		}
	}

}
