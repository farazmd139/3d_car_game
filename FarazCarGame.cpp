#include <SFML/Graphics.hpp>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <string>

int main()
{
    srand(static_cast<unsigned>(time(0)));

    sf::RenderWindow window(sf::VideoMode(800, 600), "Faraz Car Racing Game 🚗");

    // Player car as polygon (ConvexShape)
    sf::ConvexShape playerCar;
    playerCar.setPointCount(6);
    playerCar.setPoint(0, sf::Vector2f(0, 0));
    playerCar.setPoint(1, sf::Vector2f(50, 0));
    playerCar.setPoint(2, sf::Vector2f(50, 20));
    playerCar.setPoint(3, sf::Vector2f(40, 100));
    playerCar.setPoint(4, sf::Vector2f(10, 100));
    playerCar.setPoint(5, sf::Vector2f(0, 20));
    playerCar.setFillColor(sf::Color::Blue);
    playerCar.setPosition(375, 450);

    float carSpeed = 5.0f;
    float obstacleSpeed = 4.0f;
    int score = 0;

    // Obstacles as polygon cars
    std::vector<sf::ConvexShape> obstacles;

    // Font for score
    sf::Font font;
    if (!font.loadFromFile("arial.ttf"))
        return -1;

    sf::Text scoreText;
    scoreText.setFont(font);
    scoreText.setCharacterSize(24);
    scoreText.setFillColor(sf::Color::White);
    scoreText.setPosition(10, 10);

    sf::Clock clock;
    float spawnInterval = 1.5f;

    // Road lines
    std::vector<sf::RectangleShape> roadLines;
    for (int i = 0; i < 15; i++)
    {
        sf::RectangleShape line(sf::Vector2f(10, 50));
        line.setFillColor(sf::Color::White);
        line.setPosition(395, i * 100);
        roadLines.push_back(line);
    }

    while (window.isOpen())
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        // Keyboard input
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left) && playerCar.getPosition().x > 200)
            playerCar.move(-carSpeed, 0);
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right) && playerCar.getPosition().x < 550)
            playerCar.move(carSpeed, 0);

        // Spawn obstacles
        if (clock.getElapsedTime().asSeconds() > spawnInterval)
        {
            sf::ConvexShape obs;
            obs.setPointCount(6);
            obs.setPoint(0, sf::Vector2f(0, 0));
            obs.setPoint(1, sf::Vector2f(50, 0));
            obs.setPoint(2, sf::Vector2f(50, 20));
            obs.setPoint(3, sf::Vector2f(40, 100));
            obs.setPoint(4, sf::Vector2f(10, 100));
            obs.setPoint(5, sf::Vector2f(0, 20));
            obs.setFillColor(sf::Color::Red);

            float lanePositions[3] = {225, 375, 525};
            obs.setPosition(lanePositions[rand() % 3], -100);
            obstacles.push_back(obs);
            clock.restart();
        }

        // Move obstacles
        for (auto& obs : obstacles)
            obs.move(0, obstacleSpeed);

        // Collision detection
        for (auto& obs : obstacles)
        {
            if (playerCar.getGlobalBounds().intersects(obs.getGlobalBounds()))
            {
                scoreText.setString("Game Over! Score: " + std::to_string(score));
                window.clear(sf::Color::Red);
                window.draw(scoreText);
                window.display();
                sf::sleep(sf::seconds(3));
                return 0;
            }
        }

        // Remove off-screen obstacles
        obstacles.erase(std::remove_if(obstacles.begin(), obstacles.end(),
            [](sf::ConvexShape& obs) { return obs.getPosition().y > 600; }), obstacles.end());

        // Update score
        score += 1;
        scoreText.setString("Score: " + std::to_string(score));

        // Gradually increase obstacle speed
        if (score % 100 == 0)
            obstacleSpeed += 0.5f;

        // Scroll road lines
        for (auto& line : roadLines)
        {
            line.move(0, obstacleSpeed);
            if (line.getPosition().y > 600)
                line.setPosition(line.getPosition().x, -50);
        }

        // Draw everything
        window.clear(sf::Color::Green);

        // Draw road
        sf::RectangleShape road(sf::Vector2f(400, 600));
        road.setPosition(200, 0);
        road.setFillColor(sf::Color(50, 50, 50));
        window.draw(road);

        // Draw road lines
        for (auto& line : roadLines)
            window.draw(line);

        // Draw player car
        window.draw(playerCar);

        // Draw obstacles
        for (auto& obs : obstacles)
            window.draw(obs);

        // Draw score
        window.draw(scoreText);

        window.display();
    }

    return 0;
}
