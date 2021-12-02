<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{

    #[Route("", name: "app.index")]
    public function index(): Response
    {
        return $this->render('index.html.twig');
    }

    #[Route("/connect", name: "app.connection")]
    public function connection(): Response
    {
        return $this->render('game-connection.html.twig');
    }
}