import java.util.List;

public class Cuisine {
	
	int id;
	String cuisine;
	List<String> ingredients;
	
	public String toString() {
		return id + ", " + cuisine +", " + ingredients;
	}
}
