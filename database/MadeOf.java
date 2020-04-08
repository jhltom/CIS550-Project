
public class MadeOf {
	int dishId;
	int ingredientId;
	
	public MadeOf(int dishId, int ingredientId) {
		this.dishId = dishId;
		this.ingredientId = ingredientId;
	}
	public String toString() {
		return dishId + ", " + ingredientId;
	}
}
