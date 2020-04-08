
public class Dishes {
	int id;
	String cuisine;
	
	public Dishes(int id, String cuisine) {
		this.id = id;
		this.cuisine = cuisine;
	}
	public String toString() {
		return id + ", " + cuisine;
	}
}
