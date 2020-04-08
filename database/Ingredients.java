
public class Ingredients {
	int id;
	String ingredient;
	
	public Ingredients(int id, String ingredient) {
		this.id = id;
		this.ingredient = ingredient;
	}
	
	public String toString() {
		return id + ", " + ingredient;
	}
}
